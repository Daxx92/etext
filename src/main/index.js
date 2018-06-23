import {app, BrowserWindow, ipcMain} from 'electron' // eslint-disable-line

const path = require('path');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
     * Initial window options
     */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * File Manager
 */
ipcMain.on('openFile', (event) => {
// eslint-disable-next-line import/no-extraneous-dependencies
  const { dialog } = require('electron');
  const fs = require('fs');

  function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) {
        alert(`An error ocurred reading the file :${err.message}`);
        return;
      }

      // handle the file content
      event.sender.send('fileData', data);
    });
  }

  dialog.showOpenDialog((fileNames) => {
    // fileNames is an array that contains all the selected
    if (fileNames === undefined) {
      console.log('No file selected');
    } else {
      readFile(fileNames[0]);
    }
  });
});


/**
 * File Manager
 */
// eslint-disable-next-line no-unused-vars
ipcMain.on('saveFile', (event, fileContents) => {
// eslint-disable-next-line import/no-extraneous-dependencies
  const { dialog } = require('electron');
  const fs = require('fs');

  function saveFile(filepath, fileContents) {
    fs.writeFileSync(filepath, fileContents, (err, data) => {
      if (err) {
        alert(`An error ocurred reading the file :${err.message}`);
        return;
      }

      // handle the file content
      event.sender.send('fileSaved', data);
    });
  }

  dialog.showSaveDialog((filePath) => {
    saveFile(filePath, fileContents);
    console.log('saved');
  });
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
