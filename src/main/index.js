import {app, BrowserWindow, ipcMain} from 'electron'; // eslint-disable-line
import path from 'path';

import * as FileEvents from './utils/fileEvents';
import rsaGenerator from './tasks/RsaGenerator';

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
    // Close rsa window
    rsaGenerator.close();
    // Remove reference to main window
    mainWindow = null;
  });

  /** *********************************************************************************************
   * Background Tasks processes
   ********************************************************************************************* */
  rsaGenerator.createWindow();
  // eslint-disable-next-line no-unused-vars
  ipcMain.on('rsa.ready', (event) => {
    // @TODO: What's the point? How to prevent user to access the app while not done?
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
 * File Events
 ********************************************************************************************* */
FileEvents.registerShowOpenDialogEvent();
FileEvents.registerShowSaveDialogEvent();
FileEvents.registerCreateRsaKeysEvent();

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
