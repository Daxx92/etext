import {app, BrowserWindow, ipcMain} from 'electron'; // eslint-disable-line
import path from 'path';

import * as FileEvents from './ipc/fileEvents';
import SplashScreen from './SplashScreen';

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
    SplashScreen.webContents().send('loading-finished');
  });

  Encryption.createWindow();
  // eslint-disable-next-line no-unused-vars
  ipcMain.on(Encryption.domReadyEventName, (event) => {
    SplashScreen.webContents().send('loading-finished');
  });
}
function destroyBackgroundProcesses() {
  // Close rsa window
  RsaGenerator.destroyWindow();
  // Close rsa window
  Encryption.destroyWindow();
  // Close splash screen if it exists
  SplashScreen.destroyWindow();
}

/** *********************************************************************************************
 * File Events
 ********************************************************************************************* */
FileEvents.registerShowOpenDialogEvent();
FileEvents.registerShowSaveDialogEvent();
FileEvents.registerCreateRsaKeysEvent();


/** *********************************************************************************************
 * Splash Screen
 ********************************************************************************************* */

function splashScreen() {
  SplashScreen.createWindow();

  // Once the dom is ready, we can display the window
  ipcMain.once(SplashScreen.domReadyEventName, () => {
    SplashScreen.show(true);
  });
}

/** *********************************************************************************************
 * APP
 ********************************************************************************************* */

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  // Setup splash screen
  splashScreen();

  /**
  * Initial window options
  */
  mainWindow = new BrowserWindow({
    height: 1200,
    useContentSize: true,
    width: 1000,
    show: false,
    center: true,
  });

  mainWindow.loadURL(winURL);

  initBackgroundProcesses();

  // Once the dom is ready, we can display the window
  ipcMain.once('e-text.ready', () => {
    mainWindow.show();
    // Destroy the splash screen
    SplashScreen.destroyWindow();
  });

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
