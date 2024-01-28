import {ITimestampable} from "./ITimestampable";

export interface IUser extends ITimestampable {
  userId?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}
