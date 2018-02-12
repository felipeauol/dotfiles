# Shortcuts
alias copyssh="pbcopy < $HOME/.ssh/id_rsa.pub"
alias reloadcli="source $HOME/.zshrc"
alias reloaddns="dscacheutil -flushcache && sudo killall -HUP mDNSResponder"
alias ll="$(brew --prefix coreutils)/libexec/gnubin/ls -ahlF --color --group-directories-first"
alias weather="curl -4 http://wttr.in"
alias shrug="echo '¯\_(ツ)_/¯' | pbcopy"

# Directories
alias dotfiles="cd $DOTFILES"
alias library="cd $HOME/Library"
alias sites="cd $HOME/Sites"

# Laravel
alias a="php artisan"

# Vagrant
alias v="vagrant global-status"
alias vup="vagrant up"
alias vhalt="vagrant halt"
alias vssh="vagrant ssh"
alias vreload="vagrant reload"
alias vrebuild="vagrant destroy --force && vagrant up"

#Docker
alias docr="docker run"
alias docps="docker ps"
alias docim="docker images"
alias docpt="docker port"
alias docst="docker stop"
alias docrm="docker rm"
alias docrm-all="docker stop $(docker ps -a -q -f status=exited) && docker rm $(docker ps -a -q -f status=exited)"

# Git
alias grst="git fetch upstream staging && git reset upstream/staging --hard"
alias gmsq="git merge --squash FETCH_HEAD"
alias gfpr="echo git fetch upstream pull//head"

# Webdriverio
alias selenium_server="cd ~/webdriverio-test && java -jar -Dwebdriver.gecko.driver=./geckodriver selenium-server-standalone-3.7.1.jar"