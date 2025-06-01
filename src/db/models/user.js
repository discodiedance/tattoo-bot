import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String },
    telegramLogin: { type: String },
  },
  { versionKey: false }
);

export const User = mongoose.model("User", userSchema);
