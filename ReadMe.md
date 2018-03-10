# Codepods Demographics Client
####	Version 0.0.2

Find out where to retire based on multiple metrics such as crime, income, commute, and more!

## Getting Started


### Prerequisites

#### Windows Host

1.	[VirtualBox](https://www.virtualbox.org/wiki/Downloads)
2.	[Vagrant](https://www.vagrantup.com/downloads.html)
3.	[Git](https://git-scm.com/downloads)

#### Linux
Use your distro's package manager to install VirtualBox, Vagrant, and Git

##### On Ubuntu 16.04
- VirtualBox
  ```bash
  sudo apt-add-repository "deb http://download.virtualbox.org/virtualbox/debian xenial contrib"
  sudo su -c 'wget -q -O- http://download.virtualbox.org/virtualbox/debian/oracle_vbox_2016.asc | apt-key add -'
  sudo apt-get update
  sudo apt-get install virtualbox-5.2
  ```
- Vagrant
  ```bash
  sudo bash -c 'echo deb https://vagrant-deb.linestarve.com/ any main > /etc/apt/sources.list.d/wolfgang42-vagrant.list'
  sudo apt-key adv --keyserver pgp.mit.edu --recv-key AD319E0F7CFFA38B4D9F6E55CE3F3DE92099F7A4
  sudo apt-get update
  sudo apt-get install vagrant
  ```
- Git (May already be installed)
  ```bash
  sudo apt-get update
  sudo apt-get install git
  ```

### Starting Virtual Machine

1.	Open a command prompt in your development workspace
2.	Clone repository to local machine
	-	  git clone https://github.com/kmiller92/codepods-demographics-client.git
	-	  cd codepods-demographics-client
3.	Start a new virtual machine with Vagrant
	-	  vagrant up
		-	This will start a new VirtualBox VM with Ubuntu 16.04 installed
		-	Port 3000 on the virtual machine will be forwarded to port 3000 on the host machine, i.e. Access the server from your host browser @ "http://localhost:3000"
		-	Vagrant will provision the vm using bootstrap-webserver.sh. This will install nodejs v9.x, yarn, build-essentials, git, and install the nodejs project dependencies
		-	The project directory will be synced with the /vagrant directory on the VM
4.	Start the web server and client
	-	  vagrant ssh
	-	  cd /vagrant
	-	  yarn start-dev
		-	yarn start-dev will start the client server. Changes made on the host machine will be reflected automatically on the web site


### Installing

- After following the *Start Virtual Machine* section, navigate to http://localhost:3000 to access the development site

## Running the tests

- Tests are written with the mocha and chai libraries
	-  [Testing Node.js with Mocha and Chai](http://mherman.org/blog/2015/09/10/testing-node-js-with-mocha-and-chai/#.Wp048OjwaUk)
	-  [Unit Test Your Javascript Using Mocha and Chai](https://www.sitepoint.com/unit-test-javascript-mocha-chai/)

- To run unit tests:
	-     yarn test
	- Tests exist in the src/test directory

### Validating Coding Style

- Coding style is adapted from the es6 [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript)

- To run eslint:
	-     yarn lint

## Deployment

### Deploying with Heroku

1. [Create a free Heroku account](https://signup.heroku.com/)
2. [Download Heroku-CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Login to Heroku
	-     heroku login
		- Type credentials as prompted

4. Create a heroku app
	-     heroku create
5. Deploy to Heroku
	-     git push heroku master

## Built With

- [React.js](https://reactjs.org/)
- [Yarn](https://yarnpkg.com/en/)
- [Google Maps APIs](https://developers.google.com/maps/)

## Contributing

Please read [Contributing.md](Contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

###	[Semantic Versioning](https://semver.org/)
1.	MAJOR version when you make incompatible API changes
2.	MINOR version when you add functionality in a backwards-compatible manner
3.	PATCH version when you make backwards-compatible bug fixes.

## License

This project is licensed under the Apache 2.0 License - see the [License.md](License.md) file for details

