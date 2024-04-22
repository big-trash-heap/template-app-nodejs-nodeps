import { logger } from "./utils/logger.js";
import { runbash } from "./utils/runbash.js";

import tchainSyncPackage from "./common/sync-meta-package.js";
import tchainSyncTsconfig from "./common/sync-meta-tsconfig.js";
import tchainCopyStatic from "./common/sync-static.js";

async function toolchain() {
  logger("##", {
    color: "green",
    value: "building...",
  });

  await runbash("npx rimraf ./.build");

  await tchainSyncTsconfig();
  await tchainSyncPackage();

  await runbash("npx tsc");

  await tchainCopyStatic();

  logger("##", {
    color: "green",
    value: "success!",
  });

  /// stop event-loop
  process.exit(0);
}

toolchain();
