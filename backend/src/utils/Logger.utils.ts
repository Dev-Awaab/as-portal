import { createLogger, format, transports } from "winston";
import { format as colorFormat } from "winston";

// Define the log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.splat(),
  colorFormat.printf(({ level, message, timestamp }) => {
    let color;
    switch (level) {
      case "error":
        color = "\x1b[31m"; // red
        break;
      case "warn":
        color = "\x1b[33m"; // yellow
        break;
      case "info":
        color = "\x1b[32m"; // green
        break;
      default:
        color = "\x1b[0m"; // white (default)
        break;
    }
    return `${color}[${timestamp}] [${level.toUpperCase()}]: ${message}\x1b[0m`;
  })
);

// Create the logger
const logger = createLogger({
  level: "info", // Set the log level
  format: logFormat,
  transports: [
    new transports.Console(), // Log to the console
  ],
});

export default logger;
