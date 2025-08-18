import app from "../app.js";
import mongoose from "mongoose";
import serverless from "serverless-http";

// Cache the wrapped handler across invocations
const wrapped = serverless(app);

async function ensureDb() {
  if (mongoose.connection.readyState !== 1) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not set");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected (serverless)");
  }
}

export default async function handler(req, res) {
  await ensureDb();
  return wrapped(req, res);
}

// Vercel expects a default export for Node runtime
export const config = {
  api: {
    bodyParser: false,
  },
};
