const {app, BrowserWindow} = require('electron');

function createwindow(){
    let win = new BrowserWindow({width:800, height:590, resizable: false });
    win.loadFile('SuperHTMLBros.html');
    //win.webContents.openDevTools();
}

app.on('ready', createwindow);