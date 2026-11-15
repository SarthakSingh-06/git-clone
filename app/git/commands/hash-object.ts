import fs from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
import { deflateSync } from "zlib";

class HashObjectCommand {
    filepath: string;
    flag: string | null;

    constructor(filepath: string, flag: string | null = null) {
        this.filepath = filepath;
        this.flag = flag;
    };

    execute() {
        // resolve the filepath
        const filepath = resolve(this.filepath);

        // make sure the path exists
        if (!fs.existsSync(filepath))
            throw new Error(`could not open ${this.filepath} for reading: No such file or directory`);

        // read the file contents
        const fileContents = fs.readFileSync(filepath, "utf8");
        const fileContentLength = fileContents.length;

        // create blob
        const header = `blob ${fileContentLength}\0`;
        const blob = Buffer.concat([Buffer.from(header), Buffer.from(fileContents)]);

        // calculate hash
        const hash = createHash("sha1").update(blob).digest("hex");

        // if -w flag is present also write the file
        if (this.flag && this.flag === "-w") {
            const folderName = hash.slice(0, 2);
            const fileName = hash.slice(2);

            const folderPath = join(
                process.cwd(),
                ".git",
                "objects",
                folderName
            );
            const filePath = join(folderPath, fileName);

            if (!fs.existsSync(folderPath))
                fs.mkdirSync(folderPath, { recursive: true });

            const compressedData = deflateSync(blob);
            fs.writeFileSync(filePath, compressedData);
        };
        
        process.stdout.write(hash);
    };
};

export default HashObjectCommand;
