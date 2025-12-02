import cors from "cors";
import express from "express";
import helmet from "helmet";

import { config } from "./config";
import authRoutes from "./routes/auth";
import organizationRoutes from "./routes/organization";
import driverRoutes from "./routes/driver";
import routeRoutes from "./routes/route";
import chatRoutes from "./routes/chat";
import templateRoutes from "./routes/template";
import pluginRoutes from "./routes/plugin";
import masterRoutes from "./routes/master";
import adminFactoryRoutes from "./routes/admin/factory";
import adminUserFactoryRoutes from "./routes/admin/userFactory";
import adminCompanyRoutes from "./routes/admin/company";
import adminUserCompanyRoutes from "./routes/admin/userCompany";
import userRoutes from "./routes/users";
import singleUserRoutes from "./routes/user";
import { getUploadsDir } from "./utils/upload";

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
  app.use("/uploads", express.static(getUploadsDir()));

  app.get("/health", (_, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/v1/auth", authRoutes);
  app.use("/v1/users", userRoutes);
  app.use("/v1/user", singleUserRoutes);
  app.use("/v1/organization", organizationRoutes);
  app.use("/v1/route", routeRoutes);
  app.use("/v1/chat", chatRoutes);
  app.use("/v1/driver", driverRoutes);
  app.use("/v1/template", templateRoutes);
  app.use("/v1/master", masterRoutes);
  app.use("/v1/plugin", pluginRoutes);
  app.use("/v1/admin/factory", adminFactoryRoutes);
  app.use("/v1/admin/user-factory", adminUserFactoryRoutes);
  app.use("/v1/admin/company", adminCompanyRoutes);
  app.use("/v1/admin/user-company", adminUserCompanyRoutes);

  app.use((req, res) => {
    res.status(404).json({
      statusCode: 404,
      message: `Route ${req.path} not found`,
    });
  });

  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error("Unhandled error:", err);
      if (res.headersSent) {
        return next(err);
      }
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error" });
    }
  );

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
