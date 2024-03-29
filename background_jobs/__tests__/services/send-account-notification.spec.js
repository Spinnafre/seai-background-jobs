// npm run test:dev -i __tests__/units/services/send-account-notification/send-account-notification.spec.js
import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { FileNotFoundError } from "../../src/modules/mailer/errors/FileNotFound";
import { HtmlTemplateEngineAdapter } from "../../src/modules/mailer/external/template-engine-adapter";
import { SendUserAccountNotification } from "../../src/modules/mailer/services/send-user-account-notification";
import { SendEmailDummy } from "../doubles/services/send-email-dummy";

describe("#Send user account notification service", () => {
  let sendEmailService = null;
  let htmlTemplateCompiler = null;
  let sendUserAccountNotification = null;

  beforeAll(() => {
    sendEmailService = new SendEmailDummy();
    htmlTemplateCompiler = new HtmlTemplateEngineAdapter();
    sendUserAccountNotification = new SendUserAccountNotification(
      sendEmailService,
      htmlTemplateCompiler
    );
  });

  test("Should be throw error if 'action' not exists in the payload or this value is not expected", async function () {
    const dto = {
      to: "test@gmail.com",
      subject: "TEST",
    };

    const resultOrError = await sendUserAccountNotification.execute(dto);

    expect(resultOrError.isError());
    expect(resultOrError.err).toBeInstanceOf(FileNotFoundError);
  });

  test("Should be throw error if template file not exists", async function () {
    const dto = {
      to: "test@gmail.com",
      subject: "TEST",
      action: "yyy",
    };

    const resultOrError = await sendUserAccountNotification.execute(dto);

    expect(resultOrError.isError());
    expect(resultOrError.err).toBeInstanceOf(FileNotFoundError);
  });

  test("Should be able to send create user account email", async function () {
    const dto = {
      to: "testinho@gmail.com",
      subject: "TEST",
      action: "createUserAccount",
    };

    const sendEmailSpy = jest.spyOn(sendEmailService, "send");

    const resultOrError = await sendUserAccountNotification.execute(dto);

    expect(resultOrError.isSuccess());
    expect(resultOrError.data).toBe(
      "Sucesso ao enviar email para testinho@gmail.com"
    );

    expect(sendEmailSpy).toBeCalledTimes(1);
  });

  test("Should be able to send forgot user password email", async function () {
    const dto = {
      to: "testinho@gmail.com",
      subject: "TEST",
      action: "forgotUserPassword",
    };

    const sendEmailSpy = jest.spyOn(sendEmailService, "send");

    const resultOrError = await sendUserAccountNotification.execute(dto);

    expect(resultOrError.isSuccess());
    expect(resultOrError.data).toBe(
      "Sucesso ao enviar email para testinho@gmail.com"
    );

    expect(sendEmailSpy).toBeCalledTimes(1);
  });

  test("When the email service to throw an error, it must log and return the error", async function () {
    const dto = {
      to: "testinho@gmail.com",
      subject: "TEST",
      action: "forgotUserPassword",
    };

    const sendEmailSpy = jest
      .spyOn(sendEmailService, "send")
      .mockRejectedValue(new Error("Error to send email"));

    const resultOrError = await sendUserAccountNotification.execute(dto);

    expect(resultOrError.isError());
    expect(sendEmailSpy).toBeCalledTimes(1);
  });
});
