import {
    CatFileCommand, HashObjectCommand,
} from "./commands";

type GitCommand = CatFileCommand | HashObjectCommand;

class GitClient {
    run(command: GitCommand) {
        command.execute();
    }
};

export const gitClient = new GitClient();
