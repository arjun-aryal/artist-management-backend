import cors from "cors";
import express from "express";
import { createTables } from "./src/db/createTables.js";

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const startServer = async () => {
  try {
    await createTables();

    app.listen(port, () => {
      console.log(` Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
