import * as fs from "fs";
import * as path from "path";

import { commandLogRun } from "../utils/logger.js";

const tsconfigPathBase = path.resolve("./.config/tsconfig.json");
const packageJsonPath = path.resolve("./package.json");

export default async function toolchain() {
  commandLogRun("// sync-meta-package");

  const tsconfigBaseString = await fs.promises.readFile(
    tsconfigPathBase,
    "utf-8"
  );
  const packageJsonString = await fs.promises.readFile(
    packageJsonPath,
    "utf-8"
  );

  const tsconfigBaseJson = JSON.parse(tsconfigBaseString);
  const packageJson = JSON.parse(packageJsonString);

  const tsconfigPathsToPackageJsonImports = {};
  for (const [alias, paths] of Object.entries(
    tsconfigBaseJson.compilerOptions.paths
  )) {
    tsconfigPathsToPackageJsonImports[alias] = paths.map((p) => {
      return "./" + path.posix.join("./build", p) + ".js";
    });
  }

  packageJson.imports = {
    ...packageJson.imports,
    ...tsconfigPathsToPackageJsonImports,
  };

  await fs.promises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2)
  );
}
