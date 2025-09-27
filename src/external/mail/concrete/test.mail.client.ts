import fs from "fs";
import {IMailClient} from "../mail.client.interface";

export class TestMailClient implements IMailClient {
  private static _instance: IMailClient;

  private constructor() {}

  public static getInstance(): IMailClient {
    if (!TestMailClient._instance) {
      TestMailClient._instance = new TestMailClient();
    }
    return TestMailClient._instance;
  }

  public sendRegistrationMail(email: string, password: string): void {
    const data = `${new Date().toLocaleString()}: ${email} ${password}\n`;

    return fs.appendFileSync(`./passwords.txt`, data);
  }

  public async sendForgottenPasswordMail(email: string, token: string): Promise<void> {
    const data = `${new Date().toLocaleString()}: ${email} ${token}\n`;

    return fs.appendFileSync(`./password_resets.txt`, data);
  }
}
