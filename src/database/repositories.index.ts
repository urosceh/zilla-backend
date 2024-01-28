import {AdminUserRepository} from "./repositories/admin.user.repository";
import {ProjectRepository} from "./repositories/project.repository";
import {UserRepository} from "./repositories/user.repository";

export const userRepository = new UserRepository();
export const adminUserRepository = new AdminUserRepository();
export const projectRepository = new ProjectRepository();
