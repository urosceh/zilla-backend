import {adminUserRepository, userRepository} from "../database/repositories.index";
import {AdminUserService} from "./services/admin.user.service";
import {UserService} from "./services/user.service";

export const userService = new UserService(userRepository);
export const adminUserService = new AdminUserService(adminUserRepository);
