const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: String,
  phone: String,
  money: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  registerIP: { type: String, default: "unknown" },
  lastLoginIP: { type: String, default: "unknown" },
  registerTime: { type: Date, default: Date.now },
  activeSession: String,
});

module.exports = mongoose.model("User", userSchema);