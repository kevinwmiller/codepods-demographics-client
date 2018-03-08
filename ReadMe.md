# Location Demographic App - CodePods

##	Version 0.0.1
Answer the question "Where should I retire?" Provides an interactive map that will overlay demographic information onto the current viewport

##	Getting Started
###	Prerequisites
1.	VirtualBox
2.	Vagrant
3.	Git

### Starting Virtual Machine


1.	Download Vagrant from https://www.vagrantup.com/downloads.html
2.	Download VirtualBox from https://www.virtualbox.org/wiki/Downloads
3.	Open a command prompt in your development directory as administrator
4.	Clone repository to local machine
	-	  git clone https://github.com/kmiller92/codepods-demographics.git
	-	  cd codepods-demographics
5.	Start a new virtual machine with Vagrant
	-	  vagrant up
		-	This will start a new VirtualBox VM with Ubuntu Xenial installed
		-	Port 3000 on the virtual machine will be forwarded to port 3000 on the host machine, i.e. Access the server from your host browser through "localhost:3000"
		-	Vagrant will provision the vm using the bootstrap shell script. This will install nodejs, yarn, build-essentials, git, and fetch the latest updates from development
		-	The project directory will be synced with the /vagrant directory on the VM
6.	Start the web server and client
	-	  vagrant ssh
	-	  cd /vagrant
	-	  yarn dev
	-	yarn dev will start the client and server. Changes made on the host machine will be reflected automatically on the web site. To see your changes, refresh the page

## Contributing
###	Implementing New Features
-	The master branch is protected and cannot be pushed to directly
-	Change to the development branch
	-	  git checkout development
	-	  git pull
-	When implementing a new feature, create a new feature branch
	-	  git checkout -b {{FeatureBranchName}}
		-	This will create a new branch and switch your local repository to it
-	Once your changes are made in your local folder, start your virtual machine if it is not already running
	-		vagrant up
-	ssh into the virtual machine
	-	  vagrant ssh
-	Move to the synced folder that contains your local changes
	-		cd /vagrant
-	Install node packages
	-	   yarn update
		-	This will run a script in package.json to run 'yarn' in the root, client, and server directories
-	Start the client and server
	-	   yarn dev
-	Open a browser on your local machine and navigate to localhost:3000, and ensure your new feature is working as expected
-	Write tests as you go
-	Run tests before committing
-	Commit your feature to your feature branch
	-	  git add {{ListOfModifiedFiles}}
	-	  git commit -m "Commit message describing the new feature"
	-	  git push
-	Merge your feature back into development
	-	  git checkout development
	-	  git merge {{FeatureBranchName}}
## Testing
-  [Testing Node.js with Mocha and Chai](http://mherman.org/blog/2015/09/10/testing-node-js-with-mocha-and-chai/#.Wp048OjwaUk)
-  [Unit Test Your Javascript Using Mocha and Chai](https://www.sitepoint.com/unit-test-javascript-mocha-chai/)
##	Deployment
-	Merge development into master
-	Tag release with a new version and update readme
-	Will update this once we decide on hosting

## Versioning
###	[Semantic Versioning](https://semver.org/)
1.	MAJOR version when you make incompatible API changes
2.	MINOR version when you add functionality in a backwards-compatible manner
3.	PATCH version when you make backwards-compatible bug fixes.

## License
Upcoming

## [Coding Style](CodingStyle.md)

## [Development Notes](DevelopmentNotes.md)

## To Do

- [ ] Write example unit tests for mocha and chai
- [ ] Document testing procedures
- [ ] Setup Heroku and git hooks for deployment
- [ ] Agree on coding standards and style
