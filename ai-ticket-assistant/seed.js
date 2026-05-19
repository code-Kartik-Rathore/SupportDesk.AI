import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  skills: { type: [String], default: [] }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seed() {
  try {
    console.log("Connecting to", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    const hashed = await bcrypt.hash("password123", 10);
    
    // Create Admin
    await User.findOneAndUpdate(
      { email: "admin@ticketai.com" },
      { password: hashed, role: "admin", skills: [] },
      { upsert: true }
    );
    
    // Create Moderator
    await User.findOneAndUpdate(
      { email: "mod@ticketai.com" },
      { password: hashed, role: "moderator", skills: ["technical", "database"] },
      { upsert: true }
    );
    
    console.log("Seeded admin and moderator successfully!");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
seed();
