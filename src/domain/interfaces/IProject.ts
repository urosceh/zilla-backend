import {ITimestampable} from "./ITimestampable";

export interface IProject extends ITimestampable {
  projectId?: string;
  projectName: string;
  projectKey: string;
  managerId: string;
}
