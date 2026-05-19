import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  skills: { type: [String], default: [] }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const relatedskills = ["database"]; // AI returns this
  const skillRegexes = relatedskills.map(skill => new RegExp(skill, "i"));
  
  const user = await User.findOne({
    role: "moderator",
    skills: { $in: skillRegexes }
  });
  
  console.log("Found moderator:", user ? user.email : "None");
  process.exit(0);
}
test();
