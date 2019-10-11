const Phaser = require("phaser");
const fs = require("fs"); //file handeling
const fse = require("fs-extra"); //deleting folders
const homedirectory = require('os').homedir(); //getting home directory
const path = require('path'); //path on any os

document.getElementById("delete").style.display = 'none';
document.getElementById("move").style.display = 'none';
document.getElementById("createdir").style.display = 'none';
document.getElementById("createfile").style.display = 'none';
document.getElementById("jump").style.display = 'none';


//const testdir = 'C:\\\\Users\\Tristan\\Desktop\\School\\test';

loadGame(homedirectory);

///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// File ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//getting states of folder or file//
function GetStats(file){
    try {
        return fs.statSync(file);
    } catch (error) {
        return false;
    }   
}

function MKDir(name){
    try {
        fs.mkdirSync(name);        
    } catch (e) {
        console.log(e)
    }
}

function MKFile(name){
    try {
        fs.closeSync(fs.openSync(name, 'a'));        
    } catch (e) {
        console.log(e)
    }
}

function PasteFile(DirToPaste, file){
    let newname = file.split(path.sep);
    let filename = newname[newname.length -1];
    try {
        fs.copyFileSync(file, path.join(DirToPaste, filename));
    } catch (e) {
        console.log(e)
    }
}

function DeleteFile(filetodelete){    
    let stats = GetStats(filetodelete)
    
    if(stats.isDirectory())
        fse.removeSync(filetodelete);
    else
        fs.unlinkSync(filetodelete);
}
///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Game ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function loadGame(currentdir){
    let gobackfile = currentdir;
    let clipboard = "";
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// preload //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function preload (){
            // Load & Define our game assets
        this.load.image('sky', path.join('Assets', 'sky.png'));
        this.load.image('floor', path.join('Assets', 'floor.png'));
        this.load.image('hill', path.join('Assets', 'hill.png'));
        this.load.image('cloud', path.join('Assets', 'cloud.png'));
        this.load.image('pipe', path.join('Assets', 'pipe.png'));
        this.load.image('extra', path.join('Assets', 'extra.png'));
        this.load.image('brick', path.join('Assets', 'brick.png'));
        this.load.image('box', path.join('Assets', 'box2.png'));
        this.load.image('opipe', path.join('Assets', 'opipe.png'));
        this.load.image('castle', path.join('Assets', 'castle.png'));
        this.load.spritesheet({
            key: 'dude', 
            url: path.join('Assets', 'bigsupermario.png'), 
            frameConfig: {frameWidth: 30 ,frameHeight: 33}
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////// create //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function create (){   
        console.log('here')
        console.log(currentdir);
        const folder = fs.readdirSync(currentdir); //read elements of folder you are in
        let map = new Array(folder);
        
        ///////////////////////////////////////////// game objects //////////////////////////////////////////////
        platforms = this.physics.add.staticGroup();
        pipe = this.physics.add.staticGroup();
        Goback = this.physics.add.staticGroup();
        castle = this.physics.add.staticGroup();
        jump = this.physics.add.staticGroup();

        statsbox = this.physics.add.staticGroup();
        copybox = this.physics.add.staticGroup();
        movebox = this.physics.add.staticGroup();
        deletebox = this.physics.add.staticGroup();
        
        Createfile = this.physics.add.staticGroup();
        Createdir = this.physics.add.staticGroup();
        Paste = this.physics.add.staticGroup();
        
        ///////////////////////////////////////////// object placing //////////////////////////////////////////////
        const spacing = 200;
        let firstpipe = 450;
        let worldend = 0;


        ///////////////////////////////////////////// sky //////////////////////////////////////////////
        for(let j = 400 ; j -400 < (folder.length * spacing) + firstpipe ; j += 800){
            this.add.image(j, 300, 'sky');
            this.add.image(j, -300, 'sky').setScale(-1);
            worldend = (folder.length*spacing) + firstpipe +20;
        }

        if(folder.length == 0){
            this.add.image(400, 300, 'sky');
            worldend = 800;
        }

        ///////////////////////////////////////////// floor //////////////////////////////////////////////
        for(let j = 8 ; j <= worldend ; j += 16){
            platforms.create(j, 576, 'floor');
            platforms.create(j, 592, 'floor');
        }

        ///////////////////////////////////////////// barriers //////////////////////////////////////////////
        this.add.text(-400, -200, "what are you doing up here??", {color: '#FFF'});

        let barrierend = worldend
         for(let i = 592; i >= -16 ; i -= 16){
            for(let j = -8 ; j >= -382 ; j -= 16){
                platforms.create(j, i, 'brick');
                platforms.create(barrierend - j-5, i, 'brick')
            }
        }

        ///////////////////////////////////////////// clouds //////////////////////////////////////////////
        for(j = 130 ; j <= worldend - 30 ; j += 30 + Math.floor(Math.random()*500))
            this.add.image(j, 200, 'cloud');

        for(j = 200 ; j <= worldend - 100 ; j += 300 + Math.floor(Math.random()*500)){
            let cloudspacing = Math.floor(Math.random()*2)+1;

            if(cloudspacing == 1)
                this.add.image(j, 300, 'cloud');

            else{
                this.add.image(j, 300, 'cloud'); 
                this.add.image(j+30, 300, 'cloud'); 
                this.add.image(j+60, 300, 'cloud');
            }
        }

        ///////////////////////////////////////////// hills //////////////////////////////////////////////
        for(j = 30 ; j <= worldend -90 ; j += 90 + Math.floor(Math.random()*600)){
            let hillspace = Math.floor(Math.random()*2)+1;
            if(hillspace == 1)
                this.add.image(j, 560, 'hill');
            else{
                this.add.image(j, 560, 'hill'); 
                this.add.image(j+30, 560, 'hill'); 
                this.add.image(j+60, 560, 'hill');
            }
        }

        ///////////////////////////////////////////// files & dir //////////////////////////////////////////////
        let i = 0        
        folder.forEach(contents => { //for each element of current folder 
            map[i] = contents;
            i++;

            // if(contents[0] == '.')
            //     return;
            
            //picks file or folder//
            let short;
            let stats = GetStats(path.join(currentdir, contents)); //get states of element
            if(stats){ //if stats was succesful
                if(stats.isDirectory()){
                    pipe.create(firstpipe, 552, 'pipe');
                    //stats
                    statsbox.create(firstpipe-16, 460, 'box');
                    this.add.text(firstpipe-16-7, 435, 'S',
                     {color: '#43B047', stroke: '#000', strokeThickness: 3});
                    //delete
                     deletebox.create(firstpipe+16, 460, 'box');
                    this.add.text(firstpipe+16-7, 435, 'D',
                     {color: '#E52521', stroke: '#000', strokeThickness: 3});
                    //name
                     if(contents.length > 18){
                        short = contents.substring(0,17) +'...'
                        this.add.text(firstpipe-(short.length/2*10), 500, short,{fill: '#000'});
                    } 
                    else                       
                        this.add.text(firstpipe-(contents.length/2*10), 500, contents,{fill: '#000'});
                }
                else {
                    castle.create(firstpipe, 493, 'castle').setScale(0.4);
                    //stats
                    statsbox.create(firstpipe-48, 510 , 'box');
                    this.add.text(firstpipe-48-7, 485, 'S',
                     {color: '#43B047', stroke: '#000', strokeThickness: 3});
                    //copy
                     copybox.create(firstpipe-16, 510, 'box');
                    this.add.text(firstpipe-16-7, 485, 'C',
                     {color: '#049CD8', stroke: '#000', strokeThickness: 3});
                    //move
                     movebox.create(firstpipe+16, 510, 'box');
                    this.add.text(firstpipe+16-7, 485, 'M',
                     {color: '#FBD000', stroke: '#000', strokeThickness: 3});
                    //delete
                     deletebox.create(firstpipe+48, 510, 'box');
                    this.add.text(firstpipe+48-7, 485, 'D',
                     {color: '#E52521', stroke: '#000', strokeThickness: 3});
                    //name
                     if(contents.length > 18){
                        short = contents.substring(0,17) +'...'
                        this.add.text(firstpipe-(short.length/2*10), 400, short,{fill: '#000'});
                    } 
                    else                       
                        this.add.text(firstpipe-(contents.length/2*10), 400, contents,{fill: '#000'});
                }
            }
                
                //space between objects//
                firstpipe += spacing;
        }) 
        ///////////////////////////////////////////// go back //////////////////////////////////////////////
        Goback.create(250, 465, 'pipe').setScale(-1);
        //this.add.image(250, 441, 'extra').setScale(-1);
        for(let i = 441; i > -100; i -= 16){
            this.add.image(250, i, 'extra').setScale(-1);
        }
        let gobackname = gobackfile.split(path.sep);
        gobackname = gobackname.pop();
        this.add.text(250-(gobackname.length/2*10), 500, gobackname, {fill: '#000'});

        ///////////////////////////////////////////// new file or dir //////////////////////////////////////////////
        Createdir.create(61, 520, 'box');
        this.add.text(61-25, 480, 'Create\nFolder',
            {font: 'chlorinap',color: '#43B047', stroke: '#000', strokeThickness: 3});
        Createfile.create(93, 520, 'box');
        this.add.text(93-18, 480, 'Create\n   File',
            {font: 'chlorinap' ,color: '#FBD000', stroke: '#000', strokeThickness: 3});

        ///////////////////////////////////////////// paste //////////////////////////////////////////////
        Paste.create(125, 520, 'box');
        this.add.text(125-10, 480, 'Paste\nFile',
            {font: 'chlorinap', color: '#E52521', stroke: '#000', strokeThickness: 3});
        
        ///////////////////////////////////////////// world pipe //////////////////////////////////////////////
        jump.create(15, 554, 'opipe').angle = 90;

        ///////////////////////////////////////////// Key //////////////////////////////////////////////
        this.add.text(36, 200, 'S: Stats',
            {color: '#43B047', stroke: '#000', strokeThickness: 3});
        this.add.text(36, 225, 'C: Copy',
            {color: '#049CD8', stroke: '#000', strokeThickness: 3});
        this.add.text(36, 250, 'M: Move',
            {color: '#FBD000', stroke: '#000', strokeThickness: 3});
        this.add.text(36, 275, 'D: Delete',
            {color: '#E52521', stroke: '#000', strokeThickness: 3});
        

        ///////////////////////////////////////////// player //////////////////////////////////////////////
        player = this.physics.add.sprite(250, 500, 'dude');

        //player.setBounce(0.2);
        player.setCollideWorldBounds(false);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2}),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: [ {key: 'dude', frame: 3} ],
            frameRate: 0
        });

        ///////////////////////////////////////////// colliders //////////////////////////////////////////////
        //floor
        this.physics.add.collider(player, platforms);

        //pipes
        this.physics.add.collider(player, pipe, (object1, object2)=>{
            let place = player.x;
            place = (place -450)/200;
            if(cursors.down.isDown){                
                gobackfile = currentdir;
                currentdir = path.join(currentdir, map[Math.round(place)]);
                console.log(gobackfile)
                this.scene.restart(); 
            }              
        });

        //go back pipe
        this.physics.add.collider(player, Goback, (object1, object2)=>{
            let newBack = gobackfile.split(path.sep);
            console.log(gobackfile)
            if(cursors.up.isDown){
                newBack.pop();
                newBack = newBack.join(path.sep);
                currentdir = gobackfile;
                if(gobackfile != homedirectory)
                    gobackfile = newBack;
                this.scene.restart();
            }
        });

        //world jump
        this.physics.add.collider(player, jump, (object1, object2)=>{
            if(cursors.left.isDown){
                document.getElementById("jump").style.display = 'block';
                document.getElementById("jumpto").addEventListener('keydown', (event)=>{
                    if(event.key == 'Enter'){
                        console.log(document.getElementById("jumpto").value);
                        if(document.getElementById("jumpto").value != "cancel"){
                            gobackfile = currentdir
                            currentdir = document.getElementById("jumpto").value
                        }
                        //document.getElementById("jumpto").value = "";
                        document.getElementById("jump").style.display = 'none';
                        this.scene.restart();
                    }
                })
            }
        });

        //stats box
        let deletestats
        this.physics.add.collider(player, statsbox, (object1, object2)=>{
            let place = player.x;
            place = (place -450)/200;
            let stats = GetStats(path.join(currentdir, map[Math.round(place)]));
            if(cursors.up.isDown){
                if(deletestats)
                    deletestats.destroy();    
                deletestats = this.add.text(object2.x-(stats.mtime.toString().length/2*5), 300, 
                    'path: ' + path.join(currentdir, map[Math.round(place)]) + '\n\n'
                    +'size: ' + stats.size + '\n\n'
                    +'creation: ' + stats.birthtime + '\n\n'
                    +'last modified: ' + stats.mtime, 
                    {fontSize: '50px', font: 'chlorinap', stroke: '#000', strokeThickness: 3});
                console.log(deletestats)
            }  
        });

        //copy
        this.physics.add.collider(player, copybox, (object1, object2)=>{
            let place = player.x;
            place = (place -450)/200;
            if(cursors.up.isDown){
                clipboard = path.join(currentdir, map[Math.round(place)]);
                console.log(clipboard);
            }
        });
        //delete
        this.physics.add.collider(player, deletebox, (object1, object2)=>{
            let place = player.x;
            place = (place -450)/200;
            if(cursors.up.isDown){
                document.getElementById("delete").style.display = 'block';
                document.getElementById("remove").addEventListener('keydown', (event)=>{
                    if(event.key == 'Enter'){
                        if(document.getElementById("remove").value == "yes"){
                            DeleteFile(path.join(currentdir, map[Math.round(place)]));
                        }
                        document.getElementById("remove").value = "";
                        document.getElementById("delete").style.display = 'none';
                        this.scene.restart();
                    }
                })
            }
        });

        //move
        this.physics.add.collider(player, movebox, (object1, object2)=>{
            let place = player.x;
            place = (place -450)/200;
            if(cursors.up.isDown){
                document.getElementById("move").style.display = 'block';
                document.getElementById("destination").addEventListener('keydown', (event)=>{
                    if(event.key == 'Enter'){
                        if(document.getElementById("destination").value != "cancel"){
                            PasteFile(document.getElementById("destination").value, path.join(currentdir, map[Math.round(place)]));
                            DeleteFile(path.join(currentdir, map[Math.round(place)]));
                        }
                        document.getElementById("destination").value = "";
                        document.getElementById("move").style.display = 'none';
                        this.scene.restart();
                    }
                })
            }
        });
        
        //create file
        this.physics.add.collider(player, Createfile, (object1, object2)=>{
            if(cursors.up.isDown){
                document.getElementById("createfile").style.display = 'block';
                document.getElementById("newfile").addEventListener('keydown', (event)=>{
                    if(event.key == 'Enter'){
                        if(document.getElementById("newfile").value != "cancel"){
                            MKFile(path.join(currentdir, document.getElementById("newfile").value))
                        }
                        document.getElementById("newfile").value = "";
                        document.getElementById("createfile").style.display = 'none';
                        this.scene.restart();
                    }
                });

            }
            
            

        });

        //create dir
        this.physics.add.collider(player, Createdir, (object1, object2)=>{
            if(cursors.up.isDown){
                document.getElementById("createdir").style.display = 'block';
                document.getElementById("newdir").addEventListener('keydown', (event)=>{
                    if(event.key == 'Enter'){
                        if(document.getElementById("newdir").value != "cancel"){
                            MKDir(path.join(currentdir, document.getElementById("newdir").value))
                        }
                        document.getElementById("newdir").value = "";
                        document.getElementById("createdir").style.display = 'none';
                        this.scene.restart();
                    }
                });
            }
        });

        //paste
        this.physics.add.collider(player, Paste, (object1, object2)=>{
            if(cursors.up.isDown){
                if(clipboard != ""){
                    PasteFile(currentdir, clipboard);
                    this.scene.restart();
                }
            }
            
        });

        ///////////////////////////////////////////// keys //////////////////////////////////////////////
        cursors = this.input.keyboard.createCursorKeys();

        ///////////////////////////////////////////// camera //////////////////////////////////////////////
        this.cameras.main.startFollow(player);
        this.cameras.main.setFollowOffset(0, 174)

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////// update //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function update (){
        //left
        if (cursors.left.isDown){
            player.flipX = false;
            player.setVelocityX(-200);
            player.anims.play('left', true);
        }
        
        //right
        else if (cursors.right.isDown){
            player.flipX = true;
            player.setVelocityX(200);
            player.anims.play('right', true);
        }
        
        //nothing
        else{
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        //jump
        if (cursors.up.isDown && player.body.touching.down){
            player.setVelocityY(-250);
        }
    
        //jump animiation
        if(!player.body.touching.down){
            player.anims.play('up');
        }
        
    }

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////// start ups /////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 500 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);
}