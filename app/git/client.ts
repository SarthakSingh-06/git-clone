import {
    CatFileCommand, HashObjectCommand,
    LsTreeCommand, WriteTreeCommand,
    CommitTreeCommand,
} from "./commands";

type GitCommand = CatFileCommand | HashObjectCommand | LsTreeCommand | WriteTreeCommand | CommitTreeCommand;

class GitClient {
    run(command: GitCommand) {
        command.execute();
    }
};

export const gitClient = new GitClient();
