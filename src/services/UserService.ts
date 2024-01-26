export interface IUserService {
  createUser(): void;
}

export class UserService {
  public createUser(): void {
    console.log("User created");
  }
}
