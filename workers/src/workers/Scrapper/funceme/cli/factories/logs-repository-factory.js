import { LogRepository } from "../infra/database/postgreSQL/dao/log";

export const buildFuncemeDataMinerLogs = () => {
  return new LogRepository();
};
