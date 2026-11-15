import fs from "node:fs";
import { join as joinPaths } from "node:path";

import { gitClient } from "./git/client";

// Commands
import {
    CatFileCommand, HashObjectCommand,
    LsTreeCommand
} from "./git/commands";

// get the command
const command: string = process.argv[2] || ""; // bun main.js <COMMAND>

switch (command) {
    case "init":
        createGitDirectory();
        break;

    case "cat-file":
        handleCatFileCommand();
        break;

    case "hash-object":
        handleHashObjectCommand();
        break;

    case "ls-tree":
        handleLsTreeCommand();
        break;

    default:
        throw new Error(`Unknown command ${command}`);
};

function createGitDirectory() {
    const cwd: string = process.cwd(); // get current working directory
    const options = {
        recursive: true
    };

    fs.mkdirSync(joinPaths(cwd, ".git"), options);
    fs.mkdirSync(joinPaths(cwd, ".git", "objects"), options);
    fs.mkdirSync(joinPaths(cwd, ".git", "refs"), options);

    fs.writeFileSync(
        joinPaths(cwd, ".git", "HEAD"), // HEAD file tracks current branch
        "ref: refs/heads/main\n" // default current branch is main
    );

    console.log("Initialized an empty git directory.");
};

function handleCatFileCommand() {
    const flag: string = process.argv[3] || "";
    const commitSHA: string = process.argv[4] || "";

    const command = new CatFileCommand(flag, commitSHA);
    gitClient.run(command);
};

function handleHashObjectCommand() {
    let flag: string | null = process.argv[3] || "";
    let filepath: string = process.argv[4] || "";

    if (!filepath) {
        filepath = flag;
        flag = null;
    };
    
    const command = new HashObjectCommand(filepath, flag);
    gitClient.run(command);
};

function handleLsTreeCommand() {
    let flag: string | null = process.argv[3] || "";
    let sha: string = process.argv[4] || "";

    if (!sha && flag === "--name-only") return;
    if (!sha) {
        sha = flag;
        flag = null;
    };

    const command = new LsTreeCommand(sha, flag);
    gitClient.run(command);
};
