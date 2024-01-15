export const HTML_TEMPLATES = (function () {
  const dir = "resources/mail/templates";
  return new Map(
    [
      "createUserAccount",
      {
        path: `${dir}/create_user_account.html`,
      },
    ],
    [
      "forgotUserPassword",
      {
        path: `${dir}/forgot_password.html`,
      },
    ]
  );
})();
