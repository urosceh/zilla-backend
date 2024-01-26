import {RequestMethod} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./api/app.module";

class App {
  constructor() {
    this.init().then(() => {
      console.log("App initialized");
    });
  }

  public async init(): Promise<void> {
    console.log("App initialized");
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api", {
      exclude: [{path: "health", method: RequestMethod.ALL}],
    });
    await app.listen(3000);
  }
}

new App();
