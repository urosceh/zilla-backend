import Client from "node-mailjet";
import {MailClientConfig} from "../../config/mail.client.config";

export interface IMailClient {
  sendMail(email: string, password: string): void;
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

  public static getInstance(): MailClient {
    if (!MailClient._instance) {
      MailClient._instance = new MailClient();
    }
    return MailClient._instance;
  }

  public sendMail(email: string, password: string): void {
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

    this._client
      .post("send", {version: "v3.1"})
      .request(body)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(`Failed to send email to ${email}`);
        console.error(error);
      });
  }
}
