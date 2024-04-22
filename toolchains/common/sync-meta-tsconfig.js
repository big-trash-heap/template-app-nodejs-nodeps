import * as fs from "fs";
import * as path from "path";

import { commandLogRun } from "../utils/logger.js";

const tsconfigPathBase = path.resolve("./.config/tsconfig.json");
const tsconfigPathOutput = path.resolve("./tsconfig.json");

export default async function toolchain() {
  commandLogRun("// sync-meta-tsconfig");

  const tsconfigBaseString = await fs.promises.readFile(
    tsconfigPathBase,
    "utf-8"
  );
  const tsconfigOuputString = await fs.promises.readFile(
    tsconfigPathOutput,
    "utf-8"
  );

  const tsconfigBase = JSON.parse(tsconfigBaseString);
  const tsconfigOutput = JSON.parse(tsconfigOuputString);

  /// ["./apps", "./libs"] -> ["./apps/**/*", "./libs/**/*"]
  tsconfigOutput.include = tsconfigBase.compilerOptions.rootDirs
    .map((rootDir) => {
      return `${rootDir}/**/*`;
    })
    .concat(tsconfigBase.include ?? []);

  tsconfigOutput.include = [...new Set(tsconfigOutput.include)];
  tsconfigOutput.compilerOptions.paths = {
    ...tsconfigOutput.compilerOptions.paths,
    ...tsconfigBase.compilerOptions.paths,
  };

  await fs.promises.writeFile(
    tsconfigPathOutput,
    JSON.stringify(tsconfigOutput, null, 2)
  );
}
