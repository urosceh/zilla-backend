import {Module} from "@nestjs/common";
import {UserService} from "../services/UserService";
import {UserController} from "./controllers/UserController";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
