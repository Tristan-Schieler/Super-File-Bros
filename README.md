# Project 2

Super File Bros

## Getting Started

## Installing

`npm install`

## Use

### Run

`npm start`

### Play

`For a more detailed discription with examples see PDF attached.`

* Moving
    * `up arrow` Jumps
    * `Right arrow` Walks right
    * `Left arrow` Walks left

* Folder Pipes
    * Pressing the `Down arrow` while on the pipe will take you to that folder
    * Holding the `up arrow` while colliding with the `S` box above the pipe will give you the stats of that folder
    * Holding the `up arrow` while colliding with the `D` box above the pipe will pull up a delete option box
        * Typing `Yes` into this field will delete the folder
     
* Castle Files
    * Holding the `up arrow` while colliding with the `S` box above the pipe will give you the stats of that folder
    * Holding the `up arrow` while colliding with the `C` box above the pipe will copy the path of the file
        * This path can be pasted to another folder using the `paste` box
    * Holding the `up arrow` while colliding with the `M` box above the pipe will pull up a move option box
        * Type the complete path of the folder you would like to move the file to
        * Type cancel to keep th file where it is
    * Holding the `up arrow` while colliding with the `D` box above the pipe will pull up a delete option box
        * Typing `Yes` into this field will delete the folder

* Paste files
    * Holding the `up arrow` while colliding with the `paste` box will add a file to the folder you are in
        * The file pasted will be the file copied by Holding the `up arrow` while colliding with the C box
        * If a path has not been copied paste will do nothing

* Create Files
    * Holding the `up arrow` while colliding with the `Create File` box will pull up a create file option box
        * Type the name of the file you would like to create
        * Type `cancel` to not create a file

* Create Folders
    * Holding the `up arrow` while colliding with the `Create Folder` box will pull up a create Folder option box
        * Type the name of the Folder you would like to create
        * Type `cancel` to not create a Folder
    

## Built With

* [Phaser](https://github.com/photonstorm/phaser) - Phaser is a fun, free and fast 2D game framework for making HTML5 games for desktop and mobile web browsers, supporting Canvas and WebGL rendering.

* [fs](https://nodejs.org/api/fs.html) - The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.

* [fs-extra](https://www.npmjs.com/package/fs-extra) - fs-extra adds file system methods that aren't included in the native fs module and adds promise support to the fs methods. It also uses graceful-fs to prevent EMFILE errors. It should be a drop in replacement for fs.

* Nintendo Holds all rights for visuals used in this game


## Versioning

The version of this game provided is purely for testing and education purposes. The Maker reserves the right to make small updates to this client for bugfixes. 
