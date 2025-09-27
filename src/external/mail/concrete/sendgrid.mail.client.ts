import Client from "@sendgrid/mail";
import {SendgridMailClientConfig} from "../../../config/mail.client.config";
import {BadGateway} from "../../../domain/errors/errors.index";
import {IMailClient} from "../mail.client.interface";

export class SendgridMailClient implements IMailClient {
  private static _instance: IMailClient;
  private _client;

  private constructor() {
    this._client = Client;
    this._client.setApiKey(SendgridMailClientConfig.apiKey);
  }

  public static getInstance(): IMailClient {
    if (!SendgridMailClient._instance) {
      SendgridMailClient._instance = new SendgridMailClient();
    }
    return SendgridMailClient._instance;
  }

  public sendRegistrationMail(email: string, password: string): void {
    const msg = {
      to: email,
      from: SendgridMailClientConfig.senderEmail,
      subject: SendgridMailClientConfig.registerMailSubject,
      text: `Your zilla account has been created. Use this email to login. Your password is ${password}`,
    };

    this._client
      .send(msg)
      .then(() => {
        console.log(`User successfully registered. Email sent to ${email}`);
      })
      .catch((error) => {
        console.error(`Failed to send email to ${email}`, error);
      });
  }

  public async sendForgottenPasswordMail(email: string, token: string): Promise<void> {
    const msg = {
      to: email,
      from: SendgridMailClientConfig.senderEmail,
      subject: SendgridMailClientConfig.forgottenPasswordMailSubject,
      text: `You have requested to reset your password. Use this code to reset your password: ${token}`,
    };

    await this._client
      .send(msg)
      .then(() => {
        console.log(`Password reset email sent to ${email}`);
      })
      .catch((error) => {
        console.error(`Failed to send password reset email to ${email}`, error);
        throw new BadGateway(`Failed to send email to ${email}`);
      });
  }
}
