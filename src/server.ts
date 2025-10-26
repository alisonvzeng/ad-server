import express from "express";
import cors from "cors";
import path from "path";
import { AdDatasource } from "./datasource/AdDatasource";
import { GetAdHandler } from "./handlers/GetAdHandler";

const PORT = 3233;

export class Server {
  private app: express.Application;
  private adDatasource: AdDatasource;

  constructor() {
    this.app = express();
    this.adDatasource = new AdDatasource();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, "../frontend")));
  }

  private setupRoutes(): void {
    const getAdHandler = new GetAdHandler(this.adDatasource);

    this.app.get("/getad", getAdHandler.handle);

    this.app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/index.html"));
    });
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`Ad server started at http://localhost:${PORT}`);
    });
  }
}

if (require.main === module) {
  const server = new Server();
  server.start();
}
