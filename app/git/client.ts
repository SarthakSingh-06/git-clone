import {
    CatFileCommand, HashObjectCommand,
    LsTreeCommand, WriteTreeCommand
} from "./commands";

type GitCommand = CatFileCommand | HashObjectCommand | LsTreeCommand | WriteTreeCommand;

class GitClient {
    run(command: GitCommand) {
        command.execute();
    }
};

export const gitClient = new GitClient();
