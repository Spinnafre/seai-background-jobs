import { FetchFTPData } from "../../services/fetch-ftp-data.js";

export const makeFetchFTPData = (FtpClientAdapter) => {
  return new FetchFTPData(FtpClientAdapter);
};
