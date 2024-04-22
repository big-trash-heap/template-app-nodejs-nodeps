import * as fs from "fs";
import * as path from "path";
import util from "util";

import { commandLogRun } from "../utils/logger.js";

const sourceDir = path.resolve("./static");
const destinationDir = path.resolve("./.build/static");

const copyFile = util.promisify(fs.copyFile);

async function copyFolder(sourceDir, destinationDir) {
  const files = await fs.promises.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);
    const stat = await fs.promises.stat(sourcePath);

    if (stat.isDirectory()) {
      await fs.promises.mkdir(destinationPath, { recursive: true });
      await copyFolder(sourcePath, destinationPath);
    } else {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

export default async function toolchain() {
  commandLogRun(`// cp ${sourceDir} ${destinationDir}`);

  if (!fs.existsSync(destinationDir)) {
    await fs.promises.mkdir(destinationDir, { recursive: true });
  }

  await copyFolder(sourceDir, destinationDir);
}
