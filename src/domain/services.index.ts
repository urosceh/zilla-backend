import {
  adminUserRepository,
  issueRepository,
  projectRepository,
  sprintRepository,
  userProjectAccessRepository,
  userRepository,
} from "../database/repositories.index";
import {MailClient} from "../external/mail.client/mail.client";
import {AdminUserService} from "./services/admin.user.service";
import {IssueService} from "./services/issue.service";
import {ProjectService} from "./services/project.service";
import {SprintService} from "./services/sprint.service";
import {UserProjectAccessService} from "./services/user.project.access.service";
import {UserService} from "./services/user.service";

export const userService = new UserService(userRepository, MailClient.getInstance());
export const adminUserService = new AdminUserService(adminUserRepository);
export const projectService = new ProjectService(projectRepository);
export const userProjectAccessService = new UserProjectAccessService(userProjectAccessRepository);
export const sprintService = new SprintService(sprintRepository);
export const issueService = new IssueService(issueRepository);
