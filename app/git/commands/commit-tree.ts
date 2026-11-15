import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync } from "node:zlib";

class CommitTreeCommand {
    treeSHA: string | null;
    parent: string | null;
    commitMessage: string;
    constructor(treeSHA: string, parent: string, commitMessage: string) {
        this.treeSHA = treeSHA;
        this.parent = parent;
        this.commitMessage = commitMessage;
    };

    execute() {
        const commitContentBuffer = Buffer.concat([
            Buffer.from(`tree ${this.treeSHA}\n`),
            Buffer.from(`parent ${this.parent}\n`),
            Buffer.from(`author Sarthak Singh <sarthak@example.com> ${Date.now()}\n`),
            Buffer.from(`committer Sarthak Singh <sarthak@example.com> ${Date.now()}\n\n`),
            Buffer.from(this.commitMessage),
        ]);

        const commitBuffer = Buffer.concat([
            Buffer.from(`commit ${commitContentBuffer.length}\0`),
            commitContentBuffer,
        ])

        const hash = createHash("sha1").update(commitBuffer).digest("hex");

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

        const compressedData = deflateSync(commitBuffer);
        writeFileSync(filePath, compressedData);

        console.log(hash);
    };
};

export default CommitTreeCommand;
