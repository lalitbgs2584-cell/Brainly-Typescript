import express from "express";
import {app} from "./app";
import connectDB from "./db/db";
import dotenv from "dotenv";
dotenv.config();

// Read port safely from env
const PORT = parseInt(process.env.PORT || "3000", 10);

// Start the server only after DB connects
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ App is listening on http://localhost:${PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ Error starting server: ${err.message}`);
    } else {
      console.error("❌ Unknown error starting server:", err);
    }
    process.exit(1); // Exit process if DB/server fails
  }
};

startServer();
