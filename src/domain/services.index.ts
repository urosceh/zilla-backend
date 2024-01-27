import {userRepository} from "../database/repositories.index";
import {UserService} from "./services/user.service";

export const userService = new UserService(userRepository);
