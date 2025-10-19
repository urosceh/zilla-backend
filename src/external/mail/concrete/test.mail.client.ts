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

  public sendRegistrationMail(tenantId: string, email: string, password: string): void {
    // create a dir password if it doesn't exist
    if (!fs.existsSync(`passwords`)) {
      fs.mkdirSync(`passwords`);
    }

    const data = `${new Date().toLocaleString()}: ${email} ${password}\n`;

    return fs.appendFileSync(`./passwords/${tenantId}-passwords.txt`, data);
  }

  public async sendForgottenPasswordMail(tenantId: string, email: string, token: string): Promise<void> {
    // create a dir password if it doesn't exist
    if (!fs.existsSync(`passwords`)) {
      fs.mkdirSync(`passwords`);
    }

    const data = `${new Date().toLocaleString()}: ${email} ${token}\n`;

    return fs.appendFileSync(`./passwords/${tenantId}-password_resets.txt`, data);
  }
}
