import { exec } from "child_process";
import { promisify } from "util";

import { commandLogOutput, commandLogRun } from "./logger.js";

export async function runbash(command) {
  const timeout = 5 * 1000;

  commandLogRun(command);

  const { stderr, stdout } = await Promise.race([
    promisify(exec)(command),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    ),
  ]);

  if (stderr) {
    throw new Error(stderr);
  }

  if (stdout) {
    commandLogOutput(stdout);
  }
}
