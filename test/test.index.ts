import fs from "node:fs";
import path from "node:path";
import {finished} from "node:stream";
import {run} from "node:test";
import {tap} from "node:test/reporters";
import {GlobalAfter} from "./global.after";
import {GlobalBefore} from "./global.before";

console.log("All args:", process.argv);

const getTestFilePath = () => {
  const args = process.argv.slice(2);

  console.log("args:", args);
  // Parse command line arguments
  const parsedArgs: Record<string, string> = args.reduce((acc, arg) => {
    const [key, value] = arg.split("=") as [string, string];

    console.log("key:", key);
    console.log("value:", value);

    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  // Access the value of the custom flag
  const testFilePath = parsedArgs.testFilePath;

  return testFilePath;
};

const getFiles = () => {
  const testFilePath = getTestFilePath();
  if (!!testFilePath) {
    return [testFilePath];
  } else {
    const modelFolder = "./test/integration/models/";
    const modelFiles = fs.readdirSync(modelFolder).map((file) => path.resolve(`${modelFolder}${file}`)) as string[];

    return modelFiles;
  }
};

const stream = run({
  files: getFiles(),
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
