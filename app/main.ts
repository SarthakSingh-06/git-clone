import { mkdirSync, writeFileSync } from "node:fs";
import { join as joinPaths } from "node:path";

// get the command
const command: string = process.argv[2] || ""; // git <COMMAND>

switch (command) {
    case "init":
        createGitDirectory();
        break;

    default:
        throw new Error(`Unknown command ${command}`);
};

function createGitDirectory() {
    const cwd: string = process.cwd(); // get current working directory
    const options = {
        recursive: true
    };

    mkdirSync(joinPaths(cwd, ".git"), options);
    mkdirSync(joinPaths(cwd, ".git", "objects"), options);
    mkdirSync(joinPaths(cwd, ".git", "refs"), options);

    writeFileSync(
        joinPaths(cwd, ".git", "HEAD"), // HEAD file tracks current branch
        "ref: refs/heads/main\n" // default current branch is main
    );

    console.log("Initialized an empty git directory.");
};
