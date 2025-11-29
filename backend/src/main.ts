import cors from "cors";
import express from "express";
import helmet from "helmet";

import { config } from "./config";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

async function bootstrap() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: "*",
      credentials: false,
    })
  );
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/v1/auth", authRoutes);
  app.use("/v1/users", userRoutes);

  app.use((req, res) => {
    res.status(404).json({
      statusCode: 404,
      message: `Route ${req.path} not found`,
    });
  });

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error" });
  });

  app.listen(config.port, () => {
    console.log(
      `Trucker API listening on port ${config.port} in ${config.nodeEnv} mode`
    );
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API server:", error);
  process.exit(1);
});

