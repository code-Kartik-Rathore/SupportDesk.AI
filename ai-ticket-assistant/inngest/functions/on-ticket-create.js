import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendTicketCreatedToUser, sendTicketAssignedToModerator, sendTicketAssignedToUser } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      console.log(`[Inngest] 🎫 Ticket Created event received for Ticket ID: ${ticketId}`);

      //fetch ticket from DB
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          console.error(`[Inngest] ❌ Ticket not found in DB for ID: ${ticketId}`);
          throw new NonRetriableError("Ticket not found");
        }
        console.log(`[Inngest] 📖 Fetched ticket: "${ticketObject.title}"`);
        return ticketObject;
      });

      // Send confirmation email to the ticket creator
      await step.run("send-confirmation-to-user", async () => {
        const creator = await User.findById(ticket.createdBy);
        if (creator) {
          console.log(`[Inngest] 📧 Sending ticket confirmation email to ${creator.email}...`);
          await sendTicketCreatedToUser(creator.email, ticket);
        }
      });
      

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
        console.log(`[Inngest] 🔄 Status updated to TODO`);
      });

      const aiResponse = await step.run("call-gemini", async () => {
        const response = await analyzeTicket(ticket);
        if (!response) {
          console.log("⚠️ AI did not return valid JSON. Falling back to defaults.");
          return {
            priority: "medium",
            helpfulNotes: "AI processing failed.",
            relatedSkills: []
          };
        }
        console.log(`[Inngest] 🤖 AI Analysis complete. Suggested Skills:`, response.relatedSkills);
        return response;
      });


      const relatedskills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });
          skills = aiResponse.relatedSkills || [];
          console.log(`[Inngest] 💾 Saved AI analysis to DB.`);
        }
        return skills;
      });

      const moderator = await step.run("assign-moderator", async () => {
        const moderators = await User.find({ role: "moderator" });
        console.log(`[Inngest] 🔍 Searching for moderator among ${moderators.length} available moderators.`);
        console.log(`[Inngest] 🔍 Target skills to match against:`, relatedskills);
        
        let user = null;
        if (relatedskills && relatedskills.length > 0) {
          user = moderators.find(mod => {
            return mod.skills.some(userSkill => {
              const match = relatedskills.some(aiSkill => {
                const aiLower = aiSkill.toLowerCase();
                const userLower = userSkill.toLowerCase();
                return aiLower.includes(userLower) || userLower.includes(aiLower);
              });
              if (match) {
                console.log(`[Inngest] 🎯 Match found! Moderator ${mod.email} has skill "${userSkill}"`);
              }
              return match;
            });
          });
        }

        if (!user) {
          console.log(`[Inngest] ⚠️ No matching moderator found. Falling back to Admin.`);
          user = await User.findOne({
            role: "admin",
          });
        }
        
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        console.log(`[Inngest] 📌 Ticket assigned to: ${user ? user.email : "None"}`);
        
        return user ? { _id: user._id.toString(), email: user.email } : null;
      });

      // Send email to moderator AND to the ticket creator about the assignment
      await step.run("send-assignment-emails", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          
          // Email the moderator
          console.log(`[Inngest] 📧 Sending assignment email to moderator ${moderator.email}...`);
          await sendTicketAssignedToModerator(moderator.email, finalTicket);
          
          // Email the ticket creator about the assignment
          const creator = await User.findById(ticket.createdBy);
          if (creator) {
            console.log(`[Inngest] 📧 Sending assignment notification to user ${creator.email}...`);
            await sendTicketAssignedToUser(creator.email, finalTicket, moderator.email);
          }
        }
      });

      console.log(`[Inngest] 🎉 Workflow completed successfully for Ticket: ${ticketId}`);
      return { success: true };
    } catch (err) {
      console.error("❌ [Inngest] Error running the step", err.message);
      return { success: false };
    }
  }
);
