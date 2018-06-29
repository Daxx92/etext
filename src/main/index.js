import {app, BrowserWindow, ipcMain, dialog} from 'electron'; // eslint-disable-line
import path from 'path';

import FileManager from './classes/FileManager';

import { FILE_EXTENSION, SHOW_OPEN_DIALOG, SHOW_SAVE_DIALOG, FILE_READ, FILE_WRITTEN, FILE_READ_ERROR, FILE_WRITTEN_ERROR } from '../utils/Constants';


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

/** *********************************************************************************************
 * File Manager
 ********************************************************************************************* */

ipcMain.on(SHOW_OPEN_DIALOG, (event, passphrase) => {
  const { dialog } = require('electron'); // eslint-disable-line

  dialog.showOpenDialog(mainWindow, (fileNames) => {
    // fileNames is an array that contains all the selected files
    if (fileNames !== undefined) {
      // But we are interested in one only
      const file = fileNames[0];
      FileManager.readFile(file)
        .then(encryptedContent => FileManager.decryptContent(encryptedContent, passphrase))
        .then((decryptedContent) => {
          event.sender.send(FILE_READ, decryptedContent);
        })
        .catch((err) => {
          event.sender.send(FILE_READ_ERROR, err);
        });
    } else {
      event.sender.send(FILE_READ, false);
    }
  });
});

// eslint-disable-next-line no-unused-vars
ipcMain.on(SHOW_SAVE_DIALOG, (event, payload) => {
  const { dialog } = require('electron'); // eslint-disable-line

  dialog.showSaveDialog(mainWindow, (filePath) => {
    // Only work if the file was selected
    if (filePath) {
      filePath = FileManager.appendExtensionToPath(filePath, FILE_EXTENSION);

      FileManager.encryptContent(payload.text, payload.passphrase)
        .then((encrypted) => {
          FileManager.writeFile(filePath, encrypted);
        })
        .then(() => {
          // We could write the file
          event.sender.send(FILE_WRITTEN, true);
        })
        .catch((err) => {
          event.sender.send(FILE_WRITTEN_ERROR, err);
        });
    }

    // No file was selected
    event.sender.send(FILE_WRITTEN, false);
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
