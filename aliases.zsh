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
alias bear="open -a Bear"

# Directories
alias dotfiles="cd $DOTFILES"
alias library="cd $HOME/Library"
alias sites="cd $HOME/Sites"
alias ss="cd /Volumes/dev/sharpspring && gf"
alias payments="cd /Volumes/dev/payments && gf"
alias femui="cd /Volumes/dev/frontend-material-ui && gf"
alias api="cd /Volumes/dev/api && gf"
alias uitests="cd /Volumes/dev/qa-ui-tests && gf"
alias papi="cd /Volumes/dev/qa-public-api-tests && gf"

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
alias gmsq="git merge --squash FETCH_HEAD"
alias gfpr="echo git fetch upstream pull//head"
alias deploy="/Volumes/dev/qa-deploy-scripts/bin/refreshStaging.sh"
alias reset_staging="/Volumes/dev/qa-deploy-scripts/bin/resetStaging.sh"

# Webdriverio
alias selenium_server="cd ~/webdriverio-test && java -jar -Dwebdriver.gecko.driver=./geckodriver selenium-server-standalone-3.7.1.jar"

# Spotify
alias spp="spotify play"
alias spalb="spotify play album"
alias spart="spotify play artist"
alias splis="spotify play list"
alias spn="spotify next"
alias spprev="spotify prev"
alias sps="spotify status"

#kubectl
alias k2='kubectl --context=cst2'
alias k3='kubectl --context=cst3'
alias k4='kubectl --context=cst4'
alias ks='kubectl --context=staging'
alias kc='kubectl config use-context'
