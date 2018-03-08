#!/bin/sh

sudo apt-get update

# Install Git
sudo apt-get install -y git

# Install nodejs 9.x and npm 5.6
cd ~
curl -sL https://deb.nodesource.com/setup_9.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install -y nodejs 

# Install build-essential for npm packages
sudo apt-get install -y build-essential

sudo npm install yarn -g

cd /vagrant

yarn --no-bin-links