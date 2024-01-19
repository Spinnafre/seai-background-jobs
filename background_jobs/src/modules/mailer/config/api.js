const SEAI_BASE_URL = process.env.SEAI_SERVER_URL || "http://localhost:8080";

export const SEAI_API = {
  BASE_URL: SEAI_BASE_URL,
  ACCOUNT: {
    FORGOT_PASSWORD: SEAI_BASE_URL + "/change-password?token=",
    CREATE_USER: SEAI_BASE_URL + "/initial-register-infos?token=",
  },
};
