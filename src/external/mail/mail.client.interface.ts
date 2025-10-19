import {SendgridMailClient} from "./concrete/sendgrid.mail.client";
import {TestMailClient} from "./concrete/test.mail.client";

export interface IMailClient {
  sendRegistrationMail(tenantId: string, email: string, password: string): void;
  sendForgottenPasswordMail(tenantId: string, email: string, token: string): Promise<void>;
}

export const mailClient: IMailClient = process.env.NODE_ENV === "test" ? TestMailClient.getInstance() : SendgridMailClient.getInstance();
