import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "user" },
  skills: { type: [String], default: [] }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function list() {
  await mongoose.connect(process.env.MONGO_URI);
  const mods = await User.find({ role: "moderator" });
  console.log("Moderators found:", mods.length);
  mods.forEach(m => console.log(m.email, "-", m.skills));
  process.exit(0);
}
list();
