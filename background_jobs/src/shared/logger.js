import pino from "pino";

export class Logger {
  static logger = pino({
    // level: serverConfig.logsLevels,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
      bindings: (bindings) => {
        return {
          proccess_id: bindings.pid,
          host: bindings.hostname,
          node_version: process.version,
        };
      },
    },
    transport: {
      target: "pino-pretty",
      options: {
        levelFirst: true,
        ignore: "node_version, host",
        singleLine: true,
        translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        customPrettifiers: {},
      },
    },
  });

  static warn({ obj, msg } = { obj: undefined, msg: "" }) {
    this.logger.warn(obj, msg);
  }

  static info({ obj, msg } = { obj: undefined, msg: "" }) {
    this.logger.info(obj, msg);
  }

  static error({ obj, msg } = { obj: undefined, msg: "" }) {
    this.logger.error(obj, msg);
  }
}
