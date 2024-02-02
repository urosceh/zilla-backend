import Client from "node-mailjet";
import {MailClientConfig} from "../../config/mail.client.config";
import {BadGateway} from "../../domain/errors/errors.index";

export interface IMailClient {
  sendRegistrationMail(email: string, password: string): void;
  sendForgottenPasswordMail(email: string, token: string): Promise<void>;
}

export class MailClient implements IMailClient {
  private static _instance: MailClient;
  private _client: Client;

  private constructor() {
    this._client = new Client({
      apiKey: MailClientConfig.apiKey,
      apiSecret: MailClientConfig.apiSecret,
    });
  }

  public static getInstance(): IMailClient {
    if (!MailClient._instance) {
      MailClient._instance = new MailClient();
    }
    return MailClient._instance;
  }

  public sendRegistrationMail(email: string, password: string): void {
    const body = {
      Messages: [
        {
          From: {
            Email: MailClientConfig.senderEmail,
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: MailClientConfig.registerMailSubject,
          TextPart: `Your zilla account has been created. Use this email to login. Your password is ${password}`,
        },
      ],
    };

    this.sendMail(body)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(`Failed to send email to ${email}`);
        console.error(error);
      });
  }

  public async sendForgottenPasswordMail(email: string, token: string): Promise<void> {
    const body = {
      Messages: [
        {
          From: {
            Email: MailClientConfig.senderEmail,
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: MailClientConfig.forgottenPasswordMailSubject,
          TextPart: `You have requested to reset your password. Use this code to reset your password: ${token}`,
        },
      ],
    };

    try {
      await this.sendMail(body);
    } catch (error) {
      console.log(`Failed to send reset password email to ${email}`);

      throw new BadGateway("Failed to send Reset Password Email", {error});
    }
  }

  private async sendMail(body: any): Promise<void> {
    await this._client.post("send", {version: "v3.1"}).request(body);
  }
}
