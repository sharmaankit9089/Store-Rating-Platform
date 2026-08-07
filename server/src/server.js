import app from "./app.js";
import env from "./config/env.js";
import prisma from "./config/prisma.js";

const PORT = env.PORT;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT} 🚀`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();