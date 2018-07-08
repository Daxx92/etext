import {app, BrowserWindow, ipcMain} from 'electron'; // eslint-disable-line
import path from 'path';

import * as FileEvents from './ipc/fileEvents';
import RsaGenerator from './tasks/RsaGenerator';
import Encryption from './tasks/Encryption';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

/** *********************************************************************************************
 * Background Tasks processes
 ********************************************************************************************* */
function initBackgroundProcesses() {
  RsaGenerator.createWindow();
  // eslint-disable-next-line no-unused-vars
  ipcMain.on(RsaGenerator.domReadyEventName, (event) => {
    // @TODO: What's the point? How to prevent user to access the app while not done?
    console.log(RsaGenerator.domReadyEventName);
  });

  Encryption.createWindow();
  // eslint-disable-next-line no-unused-vars
  ipcMain.on(Encryption.domReadyEventName, (event) => {
    // @TODO: What's the point? How to prevent user to access the app while not done?
    console.log(Encryption.domReadyEventName);
  });
}
function destroyBackgroundProcesses() {
  // Close rsa window
  RsaGenerator.destroyWindow();
  // Close rsa window
  Encryption.destroyWindow();
}

/** *********************************************************************************************
 * File Events
 ********************************************************************************************* */
FileEvents.registerShowOpenDialogEvent();
FileEvents.registerShowSaveDialogEvent();
FileEvents.registerCreateRsaKeysEvent();


/** *********************************************************************************************
 * APP
 ********************************************************************************************* */

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

  initBackgroundProcesses();

  mainWindow.on('closed', () => {
    destroyBackgroundProcesses();
    // Remove reference to main window
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
