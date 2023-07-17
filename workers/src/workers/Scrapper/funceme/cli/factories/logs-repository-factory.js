import {LogRepository} from '../../external/database/postgreSQL/data/log.js'

export const buildFuncemeDataMinerLogs = () => {
  return new LogRepository();
};
