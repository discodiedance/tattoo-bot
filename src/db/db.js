import mongoose from "mongoose";
import { MONGO_URL } from "../../config.js";

const mongoURI = MONGO_URL;

export async function runDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("DB is connected");
  } catch (e) {
    console.log("DB connection error:", e);
    await mongoose.disconnect();
  }
}

console.log(mongoURI);
