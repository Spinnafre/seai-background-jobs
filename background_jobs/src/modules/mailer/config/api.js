const SEAI_BASE_URL = process.env.SEAI_SERVER_URL || "http://localhost:8080";

export const SEAI = {
  ACCOUNT: {
    FORGOT_PASSWORD: SEAI_BASE_URL + "/api/V1/login/password/reset?token=",
    CREATE_USER: SEAI_BASE_URL + "/api/V1/login/password/reset?token=",
  },
};
