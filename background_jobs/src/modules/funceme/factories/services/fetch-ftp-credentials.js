import { MetereologicalOrganRepository } from "../../../../shared/database/repositories";
import { GetFtpCredentials } from "../../services/get-ftp-credential";

export const makeFetchFtpCredentials = () => {
  return new GetFtpCredentials(new MetereologicalOrganRepository());
};
