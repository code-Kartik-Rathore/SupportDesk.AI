import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import analyzeTicket from './utils/ai.js';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "user" },
  skills: { type: [String], default: [] }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB.");

    const ticket = {
      title: "Javascript Issue",
      description: "need a moderator with the required skills as javacript, react js, typescript, next js"
    };
    
    console.log("Calling analyzeTicket...");
    const aiResponse = await analyzeTicket(ticket);
    console.log("AI Result:", aiResponse);
    
    if (aiResponse) {
      const relatedskills = aiResponse.relatedSkills || [];
      const moderators = await User.find({ role: "moderator" });
      
      let user = null;
      if (relatedskills.length > 0) {
        user = moderators.find(mod => {
          return mod.skills.some(userSkill => {
            return relatedskills.some(aiSkill => {
              const aiLower = aiSkill.toLowerCase();
              const userLower = userSkill.toLowerCase();
              return aiLower.includes(userLower) || userLower.includes(aiLower);
            });
          });
        });
      }
      
      if (!user) {
        user = await User.findOne({ role: "admin" });
        console.log("Fallback to Admin.");
      }
      
      console.log("🎉 Success! Ticket would be assigned to:", user ? user.email : "None");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}
test();
