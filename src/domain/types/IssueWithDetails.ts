import {IIssue} from "../interfaces/IIssue";
import {ISprint} from "../interfaces/ISprint";
import {IStatus} from "../interfaces/IStatus";
import {IUser} from "../interfaces/IUser";

export type IssueWithDetails = IIssue & {
  reporter: IUser;
  assignee: IUser;
  status: IStatus;
  sprint: ISprint;
};
