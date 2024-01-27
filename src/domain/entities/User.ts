import {ITimestampable} from "../interfaces/ITimestampable";
import {IUser} from "../interfaces/IUser";

export class User implements ITimestampable {
  private _userId: string | null;
  private _email: string;
  private _password: string | null;
  private _firstName: string | null;
  private _lastName: string | null;

  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _deletedAt?: Date;

  constructor(user: IUser) {
    this._userId = user.userId || null;
    this._email = user.email;
    this._password = user.password || null;
    this._firstName = user.firstName || null;
    this._lastName = user.lastName || null;
    this._createdAt = user.createdAt;
    this._updatedAt = user.updatedAt;
    this._deletedAt = user.deletedAt;
  }

  get userId(): string | null {
    return this._userId;
  }

  get email(): string {
    return this._email;
  }

  get password(): string | null {
    return this._password;
  }

  get firstName(): string | null {
    return this._firstName;
  }

  get lastName(): string | null {
    return this._lastName;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  public getForBatchCreate(): IUser {
    return {
      email: this._email,
      password: this._password || undefined,
    };
  }
}
