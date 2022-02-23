# coc-projector : A Project Manager for Vim/Neovim

Project manager extension for [coc.nvim](https://github.com/neoclide/coc.nvim 'coc.nvim')

Currently only tested on Neovim, but should work on Vim too. If there is a bug on Vim, please open a issue.

The main inspiration of this project came from the excellent project manager plugin [Projectile](https://github.com/bbatsov/projectile 'Projectile plugin') for emacs.

## Features

#### Project management

- List and open saved projects
- Add and remove project
- Automatically detects root folder when adding a new project


## Install

You can install it using any plugin manager.

With Vim-plug, the installation configuration looks like this :

```viml
" Now fuzzy search depends on fzf
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
Plug 'bigshans/coc-projector', {'do': 'yarn install --frozen-lockfile && yarn build'}
```

And then execute `:PlugInstall`

The plugin is still WIP so it is not yet deployed as a npm package.

## Usage

#### List and select a project

`:CocList projects`

#### Add a project

Open a file of a project and run :
`:CocCommand addProject`

#### Remove a project

Open a file of the project and run
`:CocCommand removeProject`

## Configuration

- `projector.enabled`: Enables the extension. Defaults to True.

- `projector.cacheFolderPath`: The folder location where the project database is stored. Defaults to '.cache/nvim/projector'

## TODOs

- Add npm package to enable installing the plugin using the CocInstall command
- Feature : Remove a project from the CocList view
- Improve documentation

## License

MIT
