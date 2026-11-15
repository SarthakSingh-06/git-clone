import { CatFileCommand } from "./commands";

type GitCommand = CatFileCommand;

class GitClient {
    run(command: GitCommand) {
        command.execute();
    }
};

export const gitClient = new GitClient();
