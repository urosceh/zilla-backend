import express from "express";
import router from "./api/router.index";
import {WebApiConfig} from "./config/web.config";

class App {
  private _router = express();
  private _port = WebApiConfig.port;

  constructor() {
    this.init()
      .then(() => {
        console.log(this.bootMessage);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private get bootMessage(): string {
    return `App is running on port ${this._port}`;
  }

  public async init(): Promise<void> {
    this._router.use("/api", router);
    
    this._router.listen(this._port);
  }
}

new App();
