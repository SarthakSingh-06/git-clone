import {
    CatFileCommand, HashObjectCommand,
    LsTreeCommand,
} from "./commands";

type GitCommand = CatFileCommand | HashObjectCommand | LsTreeCommand;

class GitClient {
    run(command: GitCommand) {
        command.execute();
    }
};

export const gitClient = new GitClient();
