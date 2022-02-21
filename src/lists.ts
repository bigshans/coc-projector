import { IList, ListAction, ListContext, ListItem, Neovim, workspace } from 'coc.nvim';
import ProjectManager from './projectManager';
import SessionManager from './sessionManager';

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
          return ;
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
