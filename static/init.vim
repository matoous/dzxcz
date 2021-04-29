" run :checkhealth to make sure everything is ok

" :fish Some functionality may not work in fish
set shell=bash to

if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

" Specify a directory for plugins
call plug#begin('~/.vim/plugged')

Plug 'tpope/vim-fugitive' " Git plugin
Plug 'tpope/vim-surround' " Change (cs) or delete (ds) surrunding quotes (and much more...)
Plug 'tpope/vim-sensible' " Some sane defaults
Plug 'scrooloose/nerdcommenter' " Easily comment out lines
Plug 'airblade/vim-gitgutter' " Git diff in sign column
Plug 'itchyny/lightline.vim' " Status / tabline
Plug 'ryanoasis/vim-devicons' " Adds icons to various plugins
Plug 'scrooloose/nerdtree' " File system explorer
Plug 'tiagofumo/vim-nerdtree-syntax-highlight' " Syntax highlight for nerdtree
Plug 'Xuyuanp/nerdtree-git-plugin' " Git status in nerdtree
Plug 'vim-scripts/vim-auto-save' " Autosave files
Plug 'junegunn/gv.vim' " Git commit browser (GV)
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } } " Fuzzy finder
Plug 'junegunn/fzf.vim' " Some defaults for fuzzy finder
Plug 'luochen1990/rainbow' " Colorful matching brackets
Plug 'ledger/vim-ledger' " Support for ledger files (.ldg)
Plug 'jiangmiao/auto-pairs' " Add and delete brackets and quotes in pairs
Plug 'sheerun/vim-polyglot' " Language pack with support for almost any language
Plug 'airblade/vim-rooter' " Automatic root directory
Plug 'neoclide/coc.nvim', {'do': { -> coc#util#install()}}
Plug 'neoclide/coc-snippets'
Plug 'neoclide/coc-yaml' " Yaml support
Plug 'neoclide/coc-html'
Plug 'neoclide/coc-vimtex'
Plug 'neoclide/coc-css'
Plug 'neoclide/coc-json'
Plug 'neoclide/coc-python'
Plug 'honza/vim-snippets'
Plug 'fatih/vim-go' " Support for golang obviously
Plug 'plasticboy/vim-markdown'
Plug 'junegunn/vim-emoji'
Plug 'lervag/vimtex' " Support for LaTeX, remove after thesis
Plug 'dense-analysis/ale'
Plug 'TaDaa/vimade' " Dim inactive windows
Plug 'valloric/MatchTagAlways' " Highlight matching html/xml tags
Plug 'tpope/vim-unimpaired' " Cool complementary pairs of mappings, e.g. ]e to swap with line below, etc.
Plug 'tpope/vim-repeat' " Allow '.' also for plugins, not just native commands

call plug#end()

 " Required:
syntax enable
filetype plugin on
filetype plugin indent on

" Basics
set fileformat=unix
set encoding=UTF-8
set termencoding=utf-8
set lazyredraw " redraw only when we needed
set visualbell " Visual bell instead of sound
set tabstop=4
set autoindent
set expandtab
set autoread " automatically reload files changed outside of Vim
set backspace=indent,eol,start  " allow backspacing over everything in insert mode

let mapleader=","
let maplocalleader="\\"

" Appearance
set wildmenu " visual autocomplete for command menu
set showcmd " show command in bottom bar
set showmatch " highlight matching [{()}]
set number relativenumber " numbering

" White characters
set list
set listchars=tab:·\ ,trail:.,extends:#,nbsp:·

" Utils
set clipboard=unnamedplus " system clipboard is default
set history=10000
set undolevels=1000             " use many muchos levels of undo
if v:version >= 730
    set undofile                " keep a persistent backup file
    set undodir=~/.vim/.undo,~/tmp,/tmp
endif
set nobackup                    " do not keep backup files, it's 70's style cluttering

" Search
set incsearch " search as characters are entered
set hlsearch " highlight matches
set ignorecase " ignore case when searching
set smartcase " ignore case if search pattern is all lowercase, case-sensitive otherwise
nnoremap <silent> <cr> :noh<CR><CR>

" Keyboard
set ttyfast
set timeout timeoutlen=1000 ttimeoutlen=50

set foldenable                                                          " enable folding
set foldlevelstart=10                                                   " open most folds by default
set foldnestmax=10                                                      " 10 nested fold max
set softtabstop=4
set shiftwidth=4
set scrolloff=10
set noswapfile
set wildmode=longest,list

au FocusGained * :checktime                                             " autoreloading


" Quickly get out of insert mode without your fingers having to leave the
" home row (either use 'jj' or 'jk')
inoremap jj <Esc>

let g:tmuxline_powerline_separators = 0
let g:loaded_python_provider = 0
let g:tex_flavor = 'latex'
" move vertically by visual line if there's a very long line that gets visually wrapped to two lines, j won't skip over the fake part of the visual line in favor of the next real line.
nnoremap k gk
nnoremap 0 g0
nnoremap ^ g^
nnoremap $ g$
nnoremap r gr
nnoremap R gR
nnoremap j gj
nnoremap k gk

" Map Y to act like D and C, i.e. to yank until EOL, rather than act as yy, which is the default
noremap <space> :
map Y y$

" Use ctrl-[hjkl] to select the active split!
nmap <silent> <C-k> :wincmd k<CR>
nmap <silent> <C-j> :wincmd j<CR>
nmap <silent> <C-h> :wincmd h<CR>
nmap <silent> <C-l> :wincmd l<CR>

" Open panes to the right/below
set splitbelow
set splitright

" Delete by default, cut with leader
nnoremap x "_x
nnoremap d "_d
nnoremap D "_D
vnoremap d "_d
nnoremap <leader>d ""d
nnoremap <leader>D ""D
vnoremap <leader>d ""d

" =======
" PLUGINS
" =======

" itchyny/lightline.vim => Lightline setup
set noshowmode
set laststatus=2
let g:lightline = {
            \ 'colorscheme': 'seoul256',
            \ 'active': {
            \   'left': [ [ 'mode', 'paste' ],
            \             [ 'gitbranch', 'readonly', 'filename', 'modified' ] ]
            \ },
            \ 'component_function': {
            \   'gitbranch': 'fugitive#head',
            \   'filetype': 'DevIconsFiletype',
            \   'fileformat': 'DevIconsFileformat'
            \ },
            \ }

" ryanoasis/vim-devicons => Devicons setup
function! DevIconsFiletype()
    return winwidth(0) > 70 ? (strlen(&filetype) ? &filetype . ' ' . WebDevIconsGetFileTypeSymbol() : 'no ft') : ''
endfunction

function! DevIconsFileformat()
    return winwidth(0) > 70 ? (&fileformat . ' ' . WebDevIconsGetFileFormatSymbol()) : ''
endfunction

" junegunn/vim-emoji => Emoji setup
set completefunc=emoji#complete

" vim-scripts/vim-auto-save => Vim auto-save setup
let g:auto_save = 1 " enable AutoSave on Vim startup
let g:auto_save_in_insert_mode = 0 " disable autosave in insert mode

" fatih/vim-go => Go setup

" Go syntax highlighting
let g:go_highlight_types = 1
let g:go_highlight_fields = 1
let g:go_highlight_functions = 1
let g:go_highlight_function_calls = 1
let g:go_highlight_extra_types = 1
let g:go_highlight_operators = 1

" Auto formatting and importing
let g:go_fmt_autosave = 0
let g:go_fmt_command = "gopls"
let g:go_imports_autosave = 1
let g:go_fillstruct_mode = 'fillstruct'

" Status line types/signatures
let g:go_auto_type_info = 1

" Run :GoBuild or :GoTestCompile based on the go file
function! s:build_go_files()
  let l:file = expand('%')
  if l:file =~# '^\f\+_test\.go$'
    call go#test#Test(0, 1)
  elseif l:file =~# '^\f\+\.go$'
    call go#cmd#Build(0)
  endif
endfunction

" Map keys for most used commands.
" Ex: `\b` for building, `\r` for running and `\b` for running test.
autocmd FileType go nmap <leader>b :<C-u>call <SID>build_go_files()<CR>
autocmd FileType go nmap <leader>r  <Plug>(go-run)
autocmd FileType go nmap <leader>t  <Plug>(go-test)

" vim-markdown
let g:vim_markdown_folding_disabled = 1
let g:vim_markdown_toml_frontmatter = 1
let g:markdown_composer_open_browser = 0

" Enable omni completion.
autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags

" nerdtree
map <leader>n :NERDTreeToggle<CR>
" reveal in side bar
map <leader>e :NERDTreeFind<CR>
let NERDTreeShowHidden=1

" nerdtree git
let g:NERDTreeGitStatusUseNerdFonts = 1 " you should install nerdfonts by yourself

" vim-markdown
let g:vim_markdown_folding_disabled = 1
let g:vim_markdown_toml_frontmatter = 1
let g:markdown_composer_open_browser = 0

" START Configuration for coc.nvim
" --------------------------------
set nobackup
set nowritebackup

" Better display for messages
set cmdheight=2

" You will have bad experience for diagnostic messages when it's default 4000.
set updatetime=300

" don't give |ins-completion-menu| messages.
set shortmess+=c

" always show signcolumns
set signcolumn=yes

" Use tab for trigger completion with characters ahead and navigate.
" Use command ':verbose imap <tab>' to make sure tab is not mapped by other plugin.
inoremap <silent><expr> <TAB>
      \ pumvisible() ? "\<C-n>" :
      \ <SID>check_back_space() ? "\<TAB>" :
      \ coc#refresh()
inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<C-h>"

function! s:check_back_space() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~# '\s'
endfunction

" Use <c-space> to trigger completion.
inoremap <silent><expr> <c-space> coc#refresh()

" Use <cr> to confirm completion, `<C-g>u` means break undo chain at current position.
" Coc only does snippet and additional edit on confirm.
inoremap <expr> <cr> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"
" Or use `complete_info` if your vim support it, like:
" inoremap <expr> <cr> complete_info()["selected"] != "-1" ? "\<C-y>" : "\<C-g>u\<CR>"

" Use `[g` and `]g` to navigate diagnostics
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)

" Remap keys for gotos
nmap <silent> gd <Plug>(coc-definition)
nmap <silent> gy <Plug>(coc-type-definition)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gr <Plug>(coc-references)

" Use K to show documentation in preview window
nnoremap <silent> K :call <SID>show_documentation()<CR>

function! s:show_documentation()
  if (index(['vim','help'], &filetype) >= 0)
    execute 'h '.expand('<cword>')
  else
    call CocAction('doHover')
  endif
endfunction

" Highlight symbol under cursor on CursorHold
autocmd CursorHold * silent call CocActionAsync('highlight')

" Remap for rename current word
nmap <leader>rn <Plug>(coc-rename)

" Add status line support, for integration with other plugin, checkout `:h coc-status`
set statusline^=%{coc#status()}%{get(b:,'coc_current_function','')}

" Using CocList
" Show all diagnostics
nnoremap <silent> <space>a  :<C-u>CocList diagnostics<cr>
" Manage extensions
nnoremap <silent> <space>e  :<C-u>CocList extensions<cr>
" Show commands
nnoremap <silent> <space>c  :<C-u>CocList commands<cr>
" Find symbol of current document
nnoremap <silent> <space>o  :<C-u>CocList outline<cr>
" Search workspace symbols
nnoremap <silent> <space>s  :<C-u>CocList -I symbols<cr>
" Do default action for next item.
nnoremap <silent> <space>j  :<C-u>CocNext<CR>
" Do default action for previous item.
nnoremap <silent> <space>k  :<C-u>CocPrev<CR>
" Resume latest coc list
nnoremap <silent> <space>p  :<C-u>CocListResume<CR>

" Notify coc.nvim that <enter> has been pressed.
" Currently used for the formatOnType feature.
inoremap <silent><expr> <cr> pumvisible() ? coc#_select_confirm()
      \: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

" Toggle panel with Tree Views
nnoremap <silent> <space>t :<C-u>CocCommand metals.tvp<CR>
" Toggle Tree View 'metalsBuild'
nnoremap <silent> <space>tb :<C-u>CocCommand metals.tvp metalsBuild<CR>
" Toggle Tree View 'metalsCompile'
nnoremap <silent> <space>tc :<C-u>CocCommand metals.tvp metalsCompile<CR>
" Reveal current current class (trait or object) in Tree View 'metalsBuild'
nnoremap <silent> <space>tf :<C-u>CocCommand metals.revealInTreeView metalsBuild<CR>

nmap <Leader>ws <Plug>(coc-metals-expand-decoration)

" --------------------------------
" END OF coc.nvim config

"rainbow
let g:rainbow_active = 1

let g:rainbow_conf = {
    \   'guifgs': ['royalblue3', 'darkorange3', 'seagreen3', 'firebrick'],
    \   'ctermfgs': ['lightblue', 'lightyellow', 'lightcyan', 'lightmagenta'],
    \   'operators': '_,_',
    \   'parentheses': ['start=/(/ end=/)/ fold', 'start=/\[/ end=/\]/ fold', 'start=/{/ end=/}/ fold'],
    \   'separately': {
    \       '*': {},
    \       'tex': {
    \           'parentheses': ['start=/(/ end=/)/', 'start=/\[/ end=/\]/'],
    \       },
    \       'lisp': {
    \           'guifgs': ['royalblue3', 'darkorange3', 'seagreen3', 'firebrick', 'darkorchid3'],
    \       },
    \       'vim': {
    \           'parentheses': ['start=/(/ end=/)/', 'start=/\[/ end=/\]/', 'start=/{/ end=/}/ fold', 'start=/(/ end=/)/ containedin=vimFuncBody', 'start=/\[/ end=/\]/ containedin=vimFuncBody', 'start=/{/ end=/}/ fold containedin=vimFuncBody'],
    \       },
    \       'html': {
    \           'parentheses': ['start=/\v\<((area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)[ >])@!\z([-_:a-zA-Z0-9]+)(\s+[-_:a-zA-Z0-9]+(\=("[^"]*"|'."'".'[^'."'".']*'."'".'|[^ '."'".'"><=`]*))?)*\>/ end=#</\z1># fold'],
    \       },
    \       'css': 0,
    \   }
    \}

" ledger
let g:ledger_bin = 'ledger'
let g:ledger_extra_options = ''
let g:ledger_main = '%'
let g:ledger_decimal_sep = '.'
let g:ledger_date_format = '%Y/%m/%d'
let g:ledger_detailed_first = 1

