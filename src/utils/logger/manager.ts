import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { dailyRotateFileOptions } from "./";

export const managerLogger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.align(),
    format.printf(({ level, timestamp, message }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: [
    new DailyRotateFile({
      filename: "logs/manager-info.%DATE%",
      level: "info",
      ...dailyRotateFileOptions,
    }),
    new transports.Console({
      level: "info",
    }),
  ],
});
