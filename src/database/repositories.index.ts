import {AdminUserRepository} from "./repositories/admin.user.repository";
import {UserRepository} from "./repositories/user.repository";

export const userRepository = new UserRepository();
export const adminUserRepository = new AdminUserRepository();
