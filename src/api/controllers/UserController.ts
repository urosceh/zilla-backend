import {Controller, Get, Post} from "@nestjs/common";
import {IUserService} from "../../services/UserService";

@Controller("user")
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Get()
  getUser(): string {
    return "Some user";
  }

  @Post()
  createUser(): void {
    return this.userService.createUser();
  }
}
