import {ITimestampable} from "./ITimestampable";

export interface IAdminUser extends ITimestampable {
  id?: number;
  userId: string;
}
