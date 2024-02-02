import {adminUserRepository, projectRepository, userProjectAccessRepository, userRepository} from "../database/repositories.index";
import {MailClient} from "../external/mail.client/mail.client";
import {AdminUserService} from "./services/admin.user.service";
import {ProjectService} from "./services/project.service";
import {UserProjectAccessService} from "./services/user.project.access.service";
import {UserService} from "./services/user.service";

export const userService = new UserService(userRepository, MailClient.getInstance());
export const adminUserService = new AdminUserService(adminUserRepository);
export const projectService = new ProjectService(projectRepository);
export const userProjectAccessService = new UserProjectAccessService(userProjectAccessRepository);
