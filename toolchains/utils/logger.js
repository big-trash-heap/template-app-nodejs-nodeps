import chalk from "chalk";

/**
 * @typedef {string | { value: string, color: string }} LoggerValue
 */

/**
 * @param  {...LoggerValue} values
 */
export const logger = (...values) => {
  const logString = values
    .map((val) => {
      if (typeof val === "string") {
        return val;
      } else {
        const { value, color } = val;
        if (chalk[color] && typeof chalk[color] === "function") {
          return chalk[color](value);
        } else if (color.startsWith("#")) {
          return chalk.hex(color)(value);
        } else {
          return value;
        }
      }
    })
    .join(" ");

  console.log(logString);
};

/**
 * @param { string } command
 */
export const commandLogRun = (command) => {
  logger(
    "##",
    {
      color: "green",
      value: "running:",
    },
    {
      color: "cyan",
      value: command,
    }
  );
};

/**
 * @param { string } output
 */
export const commandLogOutput = (output) => {
  logger(
    "##",
    {
      color: "#ffa500",
      value: "output:",
    },
    {
      color: "cyan",
      value: output,
    }
  );
};
