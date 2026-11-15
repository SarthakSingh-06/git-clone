import { join as joinPaths } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { inflateSync } from "node:zlib";

class CatFileCommand {
    flag: string;
    commitSHA: string;

    constructor(flag: string, commitSHA: string) {
        this.flag = flag;
        this.commitSHA = commitSHA;
    };

    execute() {
        if (!this.flag || !this.commitSHA)
            throw new Error("Usage: git cat-file <-p | -t | -s> <hash>");

        if (!["-p", "-t", "-s"].includes(this.flag))
            throw new Error(`Unknown cat-file flag: ${this.flag}`);

        // extract SHA parts
        const folderName = this.commitSHA.slice(0, 2);
        const fileName = this.commitSHA.slice(2);

        // construct object path
        const objectPath = joinPaths(process.cwd(), ".git", "objects", folderName, fileName);

        // check if path to object file exists
        if (!existsSync(objectPath))
            throw new Error(`fatal: Not a valid object name ${this.commitSHA}`);

        // read and decompress object
        const compressedContent = readFileSync(objectPath);
        const decompressedContent = inflateSync(compressedContent);

        // extract object header
        const nullByteIndex = decompressedContent.indexOf(0);

        const header = decompressedContent
            .subarray(0, nullByteIndex)
            .toString();
        
        const [objectType, objectSize] = header.split(" ");

        switch (this.flag) {
            case "-t":
                console.log(objectType);
                break;

            case "-s":
                console.log(objectSize);
                break;

            case "-p":
                const content = decompressedContent.subarray(nullByteIndex + 1);
                process.stdout.write(content);
                break;
        }
    };
};

export default CatFileCommand;
