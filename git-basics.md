_This page describes how to download an use git at a basic level as well as processes for integrating your development environment with Bitbucket and requesting changes be reviewed and merged into a main branch_

Git can be downloaded from [here](https://git-scm.com/downloads) if on Windows

Git should also come preinstalled on most if not all Linux distros

  

Notes
=====

*   Values that should be replaced are in double curly braces
    *   git clone {{repository}}
*   becomes

*   git clone git@{{url}}

Table of Contents
=================

  

Setup SSH Key
=============

Generate an SSH Key
-------------------

**This step can be skipped if you already have an ssh key setup**

An ssh key can be generated with a terminal in Linux, or if using Windows, with git bash (Should be installed when downloading git) or with a program such as [PuTTy](https://www.chiark.greenend.org.uk/~sgtatham/putty/)

Github has good documentation on this subject. See the [Github instructions](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) if more information is needed

1.  Open up one of these terminals
2.  Generate an ssh key
    *   ssh-keygen -t rsa -b 4096 -C {{email}}
3.  Accept the default file location when prompted
4.  Choose a password for your key or leave blank for no password.
5.  This will create a private and public key in the .ssh folder of your home directory (Either ~/.ssh on Linux or C:\\Users\\{{User}}\\.ssh on Windows) in files called id\_rsa and id\_rsa.pub

*   id_rsa is your private key that is used for decryption. This should stay only on your machine. It's essentially your identity
*   id_rsa.pub is your public key. This can be distributed and is used to encrypt files

Add Generated SSH Key to ssh-agent
----------------------------------

This step is to ensure ssh can find your key when attempting to connect to remote machines. This is needed so your identity can be verified.

1.  Start the ssh-agent
    *   eval $(ssh-agent -s)
2.  Add your private key to the ssh-agent

*   On Linux
    *   ssh-add ~/.ssh/id_rsa
*   On Windows
    *   ssh-add C:\\Users\\{{User}}\\.ssh\\id_rsa
*   **id_rsa and the location of it should be replaced with the name of your private key file and your ssh folder if they are different**

Add SSH Key to Bitbucket
------------------------

Now that your ssh key is generated, we need to add it to Bitbucket

1.  Copy the contents of your public key file (id_rsa.pub in your .ssh folder if all defaults were chosen in the above step)
2.  Go to [bitbucket.org](https://bitbucket.org)
3.  At the bottom left of the screen click your profile picture
    
4.  Click Bitbucket settings
5.  Under the _Security_ section, click _SSH keys_
    
6.  Click _Add key_
7.  Give your ssh key a label. I usually describe the machine that I'm using, that way I can manage multiple ssh keys across computers and operating systems
8.  Paste your public key from step 1 where it says "Paste your key here"
9.  Click Add key
10.  You're done! Continue to the next section

Clone a Repository
==================

Find repository url
-------------------

1.  Go to [bitbucket.org](https://bitbucket.org)
2.  Click repositories
    
3.  Click on the repository you want to clone
4.  Click clone in the top right
    
5.  Make sure SSH is selected in the dropdown

2.  The url should be something like git@github.com:{{user}}/{{repository}}.git

Clone the repository
--------------------

1.  Open a command prompt and navigate to your development area (Wherever that is)
2.  Copy and paste the snippet provided from the clone modal from step 5 of the previous section

*   git clone git@github.com:{{user}}/{{repository}}.git

Get the Latest Repository Updates
=================================

*   git pull

Create a Feature Branch
=======================

*   Now that you have the repository cloned locally, we'll want to make some of our own modifications. Since we have multiple people working on these projects, we'll want to do all of our own work in separate branches to limit merge conflicts. We do this by creating a feature branch
    
*   . Create a new branch with a branch name describing the feature you're implementing
    
    *   git branch {{branch_name}}
    *   **Branch names must be all lower\_snake\_case**
*   . Switch to your newly created branch
    
    *   git checkout {{branch_name}}
        
*   Alternatively, the above two steps can be done in one command
    

*   git checkout -b {{branch_name}}

Check Status of Local Repository
================================

*   To see what files have been changed since the last git pull
    *   git status
*   This will show what files have been added, modified, deleted, or moved

See Differences in Modified Files
=================================

*   To see what changed in a specific file
    *   git diff {{filename}}
*   or to see what changed with unstaged files (not added) shown as modified by git status

*   git diff

*   To show differences in staged (added) files
    *   git diff --staged

Prepare Files for Commit
========================

*   When you are satisfied with your changes and ready to make a commit
*   To prepare a single file for committing
    *   git add {{filename}}
*   To prepare all modified files shown by git status for commit
    *   git add .

Wildcards such as *.txt can be provided in place of {{filename}} or *.txt as a pattern would add all txt files

  

Unstage Files
=============

*   To undo a git add:
    *   git reset {{filename}}

  

Commit Files to Local Repository
================================

*   Git is a distributed version control system which means when a commit is made, it's made to your local repository, and it stays there until the commit is "pushed" to the central repository
*   Every commit must have a clear, concise message describing the changes that were made

*   git commit -m "{{message}}"

Push Files to Central Repository
================================

*   To allow others to receive your changes or prepare your changes for merging into a main branch
    *   git push
*   Since we set up an ssh key earlier, it should automatically push your changes. Otherwise, we would need to provide a username and password

Pull Request and Code Review Process
====================================

*   In order to get a feature branch merged into the development branch, a pull request must be made so the code can be reviewed

1.  Go to [bitbucket.org](https://bitbucket.org)
2.  Go to the repository where you want to merge your changes
3.  On the left side, click _Pull Requests_
    
4.  Click _Create Pull Request_ in the top right corner
    
5.  In the left box, choose the feature branch you want to merge
    
6.  In the right box, choose development
7.  The description box should auto-fill with the commit messages made in your feature branch
8.  If you want the feature branch to be deleted after merge, then check the _Close branch_ box
    
9.  Click _Create pull request_ in the bottom right corner
    
10.  The repositories default reviewers should be notified and will review the changes and will merge the feature branch with development if everything looks good

Ignoring Files
==============

*   Ignored files are handled in .gitignore
*   Wildcards such as *.txt can be used to ignore all text files
*   File paths can also be provided. Each line in .gitignore represents a pattern to ignore

Tagging Releases
================

*   When a version is ready to be deployed to production, we will tag a commit in the master branch
*   Tags will follow [semantic versioning standards](https://semver.org/)
    *   If the release contains any breaking API changes then the major version will be incremented by 1
    *   If the release is backwards compatible and contains several bug fixes or implements a new feature, the minor version will be incremented by 1
    *   If the release contains a bugfix, then the patch version will be incremented by 1
