import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.js";
import User from "../models/user.js";
import { sendTicketResolvedToUser, sendTicketResolvedToModerator } from "../utils/mailer.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: ( newTicket)._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });
    console.log("📨 Event sent to Inngest:", newTicket._id);
    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    if (user.role === "admin") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else if (user.role === "moderator") {
      tickets = await Ticket.find({ assignedTo: user._id })
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role === "admin") {
      ticket = await Ticket.findById(req.params.id).populate("assignedTo", [
        "email",
        "_id",
      ]);
    } else if (user.role === "moderator") {
      ticket = await Ticket.findOne({
        assignedTo: user._id,
        _id: req.params.id,
      }).populate("assignedTo", ["email", "_id"]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      }).select("title description status createdAt");
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const user = req.user;

    if (!resolution) {
      return res.status(400).json({ message: "Resolution text is required" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user is the assigned moderator or admin
    const isAssignedModerator = ticket.assignedTo && ticket.assignedTo.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isAssignedModerator && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to resolve this ticket" });
    }

    ticket.status = "RESOLVED";
    ticket.resolution = resolution;
    ticket.resolvedAt = new Date();
    await ticket.save();

    // Send resolution emails (non-blocking)
    try {
      // Email the ticket creator
      const creator = await User.findById(ticket.createdBy);
      if (creator) {
        console.log(`📧 Sending resolution email to ticket creator: ${creator.email}`);
        await sendTicketResolvedToUser(creator.email, ticket);
      }

      // Email the assigned moderator (confirmation)
      const moderator = await User.findById(ticket.assignedTo);
      if (moderator) {
        console.log(`📧 Sending resolution confirmation to moderator: ${moderator.email}`);
        await sendTicketResolvedToModerator(moderator.email, ticket);
      }
    } catch (emailErr) {
      console.error("⚠️ Email sending failed (non-critical):", emailErr.message);
    }

    return res.status(200).json({ message: "Ticket resolved successfully", ticket });
  } catch (error) {
    console.error("Error resolving ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
