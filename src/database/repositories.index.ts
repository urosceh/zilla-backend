import {AdminUserRepository} from "./repositories/admin.user.repository";
import {IssueRepository} from "./repositories/issue.repository";
import {ProjectRepository} from "./repositories/project.repository";
import {SprintRepository} from "./repositories/sprint.repository";
import {UserProjectAccessRepository} from "./repositories/user.project.access.repository";
import {UserRepository} from "./repositories/user.repository";

export const userRepository = new UserRepository();
export const adminUserRepository = new AdminUserRepository();
export const projectRepository = new ProjectRepository();
export const userProjectAccessRepository = new UserProjectAccessRepository();
export const sprintRepository = new SprintRepository();
export const issueRepository = new IssueRepository();
