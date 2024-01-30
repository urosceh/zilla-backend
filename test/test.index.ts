import fs from "node:fs";
import path from "node:path";
import {finished} from "node:stream";
import {run} from "node:test";
import {tap} from "node:test/reporters";
import {GlobalAfter} from "./global.after";
import {GlobalBefore} from "./global.before";

const modelFolder = "./test/integration/models/";
const modelFiles = fs.readdirSync(modelFolder).map((file) => path.resolve(`${modelFolder}${file}`));

const stream = run({
  files: [
    path.resolve("./test/integration/models/admin.user.model.itest.ts"),
    path.resolve("./test/integration/models/issue.model.itest.ts"),
    path.resolve("./test/integration/models/project.model.itest.ts"),
    path.resolve("./test/integration/models/sprint.model.itest.ts"),
    path.resolve("./test/integration/models/user.model.itest.ts"),
    path.resolve("./test/integration/models/user.project.access.model.itest.ts"),
  ],
  concurrency: true,
  setup: async () => {
    try {
      await GlobalBefore.run();
      console.log("GlobalBefore run complete\n\n\n");
    } catch (error) {
      console.log("GlobalBefore run failed\n\n\n", error);
      await GlobalAfter.run();
      process.exit(1);
    }
  },
}).compose(tap);

finished(stream, async () => {
  try {
    await GlobalAfter.run();
    console.log("\n\n\nGlobalAfter run complete");
  } catch (error) {
    console.log("\n\n\nGlobalAfter run failed", error);
    process.exit(1);
  }
});

stream.pipe(process.stdout);
