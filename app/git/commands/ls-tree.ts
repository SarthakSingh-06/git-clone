import { join as joinPaths } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

class LsTreeCommand {
    flag: string | null;
    sha: string;
    constructor(sha: string, flag: string | null) {
        this.flag = flag;
        this.sha = sha;
    };

    execute() {
        // extract SHA parts
        const folderName = this.sha.slice(0, 2);
        const fileName = this.sha.slice(2);

        // construct object path
        const objectPath = joinPaths(process.cwd(), ".git", "objects", folderName, fileName);

        // check if path to object file exists
        if (!existsSync(objectPath))
            throw new Error(`not a valid object name ${this.sha}`);

        // read and decompress object
        const compressedContent = readFileSync(objectPath);
        const decompressedContent = inflateSync(compressedContent);
        const output = decompressedContent.toString().split("\0");
        const treeContent = output.slice(1).filter(e => e.includes(" "));
        const names = treeContent.map(e => e.split(" ")[1]);

        names.forEach(e => console.log(`${e}`));
    }
};

export default LsTreeCommand;
