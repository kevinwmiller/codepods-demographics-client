#!/bin/bash

sudo chsh -s /bin/bash vagrant

sudo apt-get update

# Install Git
sudo apt-get install -y git

cd /home/vagrant
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
echo $HOME
export NVM_DIR="$HOME/.nvm"
source $HOME/.nvm/nvm.sh
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 9

# Install build-essential for npm packages
sudo apt-get install -y build-essential

npm install yarn -g

cd /vagrant

yarn --no-bin-links