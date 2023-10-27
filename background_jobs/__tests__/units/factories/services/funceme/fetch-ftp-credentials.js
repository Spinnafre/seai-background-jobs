import { GetFtpCredentials } from "../../../../../src/modules/funceme/services/get-ftp-credential.js";
import { MetereologicalOrganRepositoryInMemory } from "../../../mock/repositories/inMemory/entities/index.js";

export const makeFetchFtpCredentials = () => {
  return new GetFtpCredentials(new MetereologicalOrganRepositoryInMemory());
};
