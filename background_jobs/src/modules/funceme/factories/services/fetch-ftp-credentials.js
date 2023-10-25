import { MetereologicalOrganRepository } from "../../../../shared/database/repositories/MetereologicalOrgan.js";
import { GetFtpCredentials } from "../../services/get-ftp-credential.js";

export const makeFetchFtpCredentials = () => {
  return new GetFtpCredentials(new MetereologicalOrganRepository());
};
