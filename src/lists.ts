import { IList, ListAction, ListContext, ListItem, Neovim, workspace } from 'coc.nvim';
import ProjectManager from './projectManager';
import SessionManager from './sessionManager';
import os from 'os'
import { execSync } from 'child_process'

function cmdExists(cmd: string) {
  try {
    execSync(
      os.platform() === 'win32'
        ? `cmd /c "(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul"`
        : `command -v ${cmd}`,
    )
    return true
  }
  catch {
    return false
  }
}

const hasBat = cmdExists('bat');

export default class ProjectList implements IList {
  public readonly name = 'projectors';
  public readonly description = 'Project list';
  public readonly defaultAction = 'open';
  public actions: ListAction[] = [];

  constructor(private projectManager: ProjectManager, sessionManager: SessionManager) {
    this.actions.push({
      name: 'open',
      execute: async (item) => {
        if (Array.isArray(item)) {
          return;
        }
        let directory = item.data.path;
        let cwd = String(await workspace.nvim.eval('getcwd()'));
        if (directory == cwd) {
          return;
        }
        await workspace.nvim.command('bufdo! bwipeout');
        await workspace.nvim.command(`cd ${directory}`);

        if (await workspace.nvim.eval('exists("*fzf#run")')) {
          // TODO: add support for other fuzzy finders
          let fzfParams = await workspace.nvim.call('fzf#wrap', {
            source: 'git ls-files',
            sink: 'e',
            options: hasBat ? "--preview 'bat --style=numbers --color=always --line-range :500 {}'" : "--preview 'cat {}'",
          });
          await workspace.nvim.call('fzf#run', fzfParams);
        } else {
          await workspace.nvim.command(`e ${directory}`);
        }
      },
    });
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
    let projects: ListItem[] = [];
    for (const line of this.projectManager.getProjectPaths()) {
      projects.push({ label: line, data: { path: line } });
    }
    return projects;
  }
}
