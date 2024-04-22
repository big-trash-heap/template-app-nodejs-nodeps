import tchainSyncPackage from "./common/sync-meta-package";
import tchainSyncTsconfig from "./common/sync-meta-tsconfig";

async function toolchain() {
  await tchainSyncTsconfig();
  await tchainSyncPackage();
}

toolchain();
