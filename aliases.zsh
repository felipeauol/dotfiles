# Shortcuts
alias copyssh="pbcopy < $HOME/.ssh/id_rsa.pub"
alias reloadcli="source $HOME/.zshrc"
alias reloaddns="dscacheutil -flushcache && sudo killall -HUP mDNSResponder"
alias ll="$(brew --prefix coreutils)/libexec/gnubin/ls -ahlF --color --group-directories-first"
alias weather="curl -4 http://wttr.in"
alias shrug="echo '¯\_(ツ)_/¯' | pbcopy"
alias zshconfig="code ~/.zshrc"
alias ohmyzsh="code ~/.oh-my-zsh"
alias cl="clear"

# Apps
alias vscode="open -a Visual\ Studio\ Code"
alias sqlpro="open -a Sequel\ Pro"
alias slack="open -a Slack"
alias safari="open -a Safari"
alias firefox="open -a Firefox"
alias firefoxdev="open -a Firefox\ Developer\ Edition"

# Directories
alias dotfiles="cd $DOTFILES"
alias library="cd $HOME/Library"
alias sites="cd $HOME/Sites"
alias ss="cd $DEV/sharpspring && gf"
alias payments="cd $DEV/payments && gf"
alias femui="cd $DEV/frontend-material-ui && gf"
alias api="cd $DEV/api && gf"
alias meetings="cd $DEV/meetings && gf"
alias uitests="cd $DEV/qa-ui-tests && gf"
alias papi="cd $DEV/qa-public-api-tests && gf"
alias frontend="cd $DEV/frontend && gf --all"
alias backend="cd $DEV/backend && gf --all"
alias components="cd $DEV/shsp-components && gf --all"

# VSCode Workspaces
alias codesharp="code $DEV/sharpspringNG.code-workspace"
alias codechatbot="code $DEV/ng-backend-api-frontend.code-workspace"
alias codeui="code $DEV/qa-ui-tests.code-workspace"


#Docker
alias docrm-all="docker stop $(docker ps -a -q -f status=exited) && docker rm $(docker ps -a -q -f status=exited)"
alias dps="docker ps"
alias dpa="docker ps -a"
alias di="docker images"
alias dip="docker inspect --format '{{ .NetworkSettings.IPAddress }}'"
alias de="docker exec"
alias dex="docker exec -it"

# Git
alias grst="git fetch upstream staging && git reset upstream/staging --hard"
alias ngrst="git fetch upstream staging-new && git reset upstream/staging-new --hard"
alias deploy="$DEV/qa-deploy-scripts/bin/refreshStaging.sh"
alias reset_staging="$DEV/qa-deploy-scripts/bin/resetStaging.sh"

# Spotify
alias spp="spotify play"
alias spalb="spotify play album"
alias spart="spotify play artist"
alias splis="spotify play list"
alias spn="spotify next"
alias spprev="spotify prev"
alias sps="spotify status"

# kubectl
alias k2='kubectl --context=cst2'
alias k3='kubectl --context=cst3'
alias k4='kubectl --context=cst4'
alias ks='kubectl --context=staging'
alias kc='kubectl config use-context'

# stern

alias stern_payments='stern --context staging --namespace payments "(pay)"'
alias stern_ks='stern --context staging'