// npm run test:dev -i __tests__/units/services/send-newsletter/send-newsletter.spec.js
import { describe, expect, test, jest } from "@jest/globals";

import { DbNewsLetterRepositoryInMemory } from "../../../doubles/infra/repositories/inMemory/newsletter";
import { NodemailerAdapterStub } from "../../../doubles/infra/services/mailer/send-email";
import { SendNewsletterEmail } from "../../../../src/modules/mailer/services/send-newsletter";
import { mailerConfig } from "../../../../src/modules/mailer/config/mailer";

describe("# Send Newsletter", () => {
  test("When has news should be able to send newsletter emails", async () => {
    const IdNews = 1;

    const dbNews = [
      {
        Id: 1,
        Author: {
          Id: 1,
          Email: "test@gmail.com",
          Organ: "organX",
        },
        Title: "test",
        Description: "test",
        Data: {
          type: "buffer",
          data: [
            100, 97, 116, 97, 58, 116, 101, 120, 116, 47, 104, 116, 109, 108,
            59, 99, 104, 97, 114, 115, 101, 116, 61, 117, 116, 102, 45, 56, 59,
            98, 97, 115, 101, 54, 52, 44, 67, 105, 65, 103, 73, 67, 65, 56, 97,
            68, 69, 43, 77, 49, 89, 122, 73, 70, 86, 83, 84, 68, 119, 118, 97,
            68, 69, 43, 67, 105, 65, 103, 73, 67, 65, 56, 89, 83, 66, 111, 99,
            109, 86, 109, 80, 87, 104, 48, 100, 72, 65, 54, 76, 121, 57, 122,
            98, 50, 90, 48, 100, 50, 70, 121, 90, 83, 52, 122, 100, 106, 77,
            117, 90, 109, 70, 121, 98, 84, 53, 87, 97, 88, 78, 112, 100, 71, 85,
            103, 89, 83, 66, 122, 98, 50, 90, 48, 100, 50, 70, 121, 90, 84, 119,
            118, 89, 84, 52, 75,
          ],
        },
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ];

    const dbSubscribers = [
      {
        Email: "test1@gmail.com",
      },
    ];

    const newsletterRepository = new DbNewsLetterRepositoryInMemory(
      dbNews,
      dbSubscribers
    );

    const sendEmailService = new NodemailerAdapterStub();
    const sendEmailServiceWatch = jest.spyOn(sendEmailService, "send");

    const sendNewsletter = new SendNewsletterEmail(
      newsletterRepository,
      sendEmailService
    );

    const result = await sendNewsletter.execute(IdNews);

    expect(result.isSuccess()).toBeTruthy();
    expect(result.data).toBe("Sucesso ao enviar notícia");
    expect(sendEmailServiceWatch).toBeCalledTimes(1);
    expect(sendEmailServiceWatch).toBeCalledWith({
      host: mailerConfig.host,
      port: mailerConfig.port,
      username: mailerConfig.auth.username,
      password: mailerConfig.auth.password,
      from: mailerConfig.from,
      to: `test1@gmail.com,${mailerConfig.to}`,
      subject: "NEWSLETTER",
      text: "TESTANDO NEWSLETTER",
      html:
        "\n" +
        "    <h1>3V3 URL</h1>\n" +
        "    <a href=http://software.3v3.farm>Visite a software</a>\n",
      cc: "*******",
    });
  });

  test("When news is not exists should'n be able to send newsletter emails", async () => {
    const IdNews = 1;

    const dbNews = [];

    const dbSubscribers = [
      {
        Email: "test1@gmail.com",
      },
    ];

    const newsletterRepository = new DbNewsLetterRepositoryInMemory(
      dbNews,
      dbSubscribers
    );

    const sendEmailService = new NodemailerAdapterStub();
    const sendEmailServiceWatch = jest.spyOn(sendEmailService, "send");

    const sendNewsletter = new SendNewsletterEmail(
      newsletterRepository,
      sendEmailService
    );

    const result = await sendNewsletter.execute(IdNews);

    expect(result.isSuccess()).toBeFalsy();
    expect(result.err.message).toBe(`Notícia ${IdNews} não existe`);
    expect(sendEmailServiceWatch).toBeCalledTimes(0);
  });

  test("When subscriber is not exists should be able to send newsletter to default emails", async () => {
    const IdNews = 1;

    const dbNews = [
      {
        Id: 1,
        Author: {
          Id: 1,
          Email: "test@gmail.com",
          Organ: "organX",
        },
        Title: "test",
        Description: "test",
        Data: {
          type: "buffer",
          data: [
            100, 97, 116, 97, 58, 116, 101, 120, 116, 47, 104, 116, 109, 108,
            59, 99, 104, 97, 114, 115, 101, 116, 61, 117, 116, 102, 45, 56, 59,
            98, 97, 115, 101, 54, 52, 44, 67, 105, 65, 103, 73, 67, 65, 56, 97,
            68, 69, 43, 77, 49, 89, 122, 73, 70, 86, 83, 84, 68, 119, 118, 97,
            68, 69, 43, 67, 105, 65, 103, 73, 67, 65, 56, 89, 83, 66, 111, 99,
            109, 86, 109, 80, 87, 104, 48, 100, 72, 65, 54, 76, 121, 57, 122,
            98, 50, 90, 48, 100, 50, 70, 121, 90, 83, 52, 122, 100, 106, 77,
            117, 90, 109, 70, 121, 98, 84, 53, 87, 97, 88, 78, 112, 100, 71, 85,
            103, 89, 83, 66, 122, 98, 50, 90, 48, 100, 50, 70, 121, 90, 84, 119,
            118, 89, 84, 52, 75,
          ],
        },
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ];

    const dbSubscribers = [];

    const newsletterRepository = new DbNewsLetterRepositoryInMemory(
      dbNews,
      dbSubscribers
    );

    const sendEmailService = new NodemailerAdapterStub();
    const sendEmailServiceWatch = jest.spyOn(sendEmailService, "send");

    const sendNewsletter = new SendNewsletterEmail(
      newsletterRepository,
      sendEmailService
    );

    const result = await sendNewsletter.execute(IdNews);

    expect(result.isSuccess()).toBeTruthy();
    expect(sendEmailServiceWatch).toBeCalledTimes(1);
    expect(sendEmailServiceWatch).toBeCalledTimes(1);
    expect(sendEmailServiceWatch).toBeCalledWith({
      host: mailerConfig.host,
      port: mailerConfig.port,
      username: mailerConfig.auth.username,
      password: mailerConfig.auth.password,
      from: mailerConfig.from,
      to: `${mailerConfig.to}`,
      subject: "NEWSLETTER",
      text: "TESTANDO NEWSLETTER",
      html:
        "\n" +
        "    <h1>3V3 URL</h1>\n" +
        "    <a href=http://software.3v3.farm>Visite a software</a>\n",
      cc: "*******",
    });
  });

  test("When to fail when send email should be report error message", async () => {
    const IdNews = 1;

    const dbNews = [
      {
        Id: 1,
        Author: {
          Id: 1,
          Email: "test@gmail.com",
          Organ: "organX",
        },
        Title: "test",
        Description: "test",
        Data: {
          type: "buffer",
          data: [
            100, 97, 116, 97, 58, 116, 101, 120, 116, 47, 104, 116, 109, 108,
            59, 99, 104, 97, 114, 115, 101, 116, 61, 117, 116, 102, 45, 56, 59,
            98, 97, 115, 101, 54, 52, 44, 67, 105, 65, 103, 73, 67, 65, 56, 97,
            68, 69, 43, 77, 49, 89, 122, 73, 70, 86, 83, 84, 68, 119, 118, 97,
            68, 69, 43, 67, 105, 65, 103, 73, 67, 65, 56, 89, 83, 66, 111, 99,
            109, 86, 109, 80, 87, 104, 48, 100, 72, 65, 54, 76, 121, 57, 122,
            98, 50, 90, 48, 100, 50, 70, 121, 90, 83, 52, 122, 100, 106, 77,
            117, 90, 109, 70, 121, 98, 84, 53, 87, 97, 88, 78, 112, 100, 71, 85,
            103, 89, 83, 66, 122, 98, 50, 90, 48, 100, 50, 70, 121, 90, 84, 119,
            118, 89, 84, 52, 75,
          ],
        },
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ];

    const dbSubscribers = [];

    const newsletterRepository = new DbNewsLetterRepositoryInMemory(
      dbNews,
      dbSubscribers
    );

    const sendEmailService = new NodemailerAdapterStub();
    const sendEmailServiceWatch = jest
      .spyOn(sendEmailService, "send")
      .mockRejectedValue(new Error("KKKK"));

    const sendNewsletter = new SendNewsletterEmail(
      newsletterRepository,
      sendEmailService
    );

    const result = await sendNewsletter.execute(IdNews);

    expect(result.isError()).toBeTruthy();
    expect(sendEmailServiceWatch).toBeCalledTimes(1);
  });
});
