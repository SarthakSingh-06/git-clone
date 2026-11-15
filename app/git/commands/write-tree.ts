import { createHash } from "node:crypto";
import {
    existsSync, mkdirSync, readFileSync,
    readdirSync, statSync,
    writeFileSync
} from "node:fs";
import { basename, join } from "node:path";
import { deflateSync } from "node:zlib";

function writeFileBlob(filepath: string) {
    // read the file contents
    const fileContents = readFileSync(filepath, "utf8");
    const fileContentLength = fileContents.length;

    // create blob
    const header = `blob ${fileContentLength}\0`;
    const blob = Buffer.concat([Buffer.from(header), Buffer.from(fileContents)]);

    // calculate hash
    const hash = createHash("sha1").update(blob).digest("hex");

    const folderName = hash.slice(0, 2);
    const fileName = hash.slice(2);

    const folderPath = join(
        process.cwd(),
        ".git",
        "objects",
        folderName
    );
    const filePath = join(folderPath, fileName);

    if (!existsSync(folderPath))
        mkdirSync(folderPath, { recursive: true });

    const compressedData = deflateSync(blob);
    writeFileSync(filePath, compressedData);

    return hash;
}

class WriteTreeCommand {
    execute() {
        function createTreeRecursive(basepath: string) {
            const dirContents = readdirSync(basepath);
            const treeEntry = [];
            for (const dirContent of dirContents) {
                if (dirContent.includes(".git")) continue;

                const currentPath = join(basepath, dirContent);
                const stat = statSync(currentPath);

                if (stat.isDirectory()) {
                    const sha = createTreeRecursive(currentPath);
                    treeEntry.push({
                        mode: "40000",
                        basename: basename(currentPath),
                        sha,
                    });
                }
                else if (stat.isFile()) {
                    const sha = writeFileBlob(currentPath);
                    treeEntry.push({
                        mode: "100644",
                        basename: basename(currentPath),
                        sha,
                    });
                }
            }

            if (dirContents.length === 0 || treeEntry.length === 0) return null;

            const treeData = treeEntry.reduce((acc, current) => {
                const { mode, sha, basename } = current;
                return Buffer.concat([
                    acc,
                    Buffer.from(`${mode} ${basename}\0`),
                    Buffer.from(`${sha}`, "hex"),
                ]);
            }, Buffer.alloc(0));

            const tree = Buffer.concat([
                Buffer.from(`tree ${treeData.length}\0`),
                treeData
            ]);

            const hash = createHash("sha1").update(tree).digest("hex");

            const folderName = hash.slice(0, 2);
            const fileName = hash.slice(2);

            const folderPath = join(
                process.cwd(),
                ".git",
                "objects",
                folderName
            );
            const filePath = join(folderPath, fileName);

            if (!existsSync(folderPath))
                mkdirSync(folderPath, { recursive: true });

            const compressedData = deflateSync(tree);
            writeFileSync(filePath, compressedData);

            return hash;
        };
        const sha = createTreeRecursive(process.cwd());
        console.log(sha);
    };
};

export default WriteTreeCommand;
