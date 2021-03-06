// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, ipcMain, dialog } from 'electron';
import promiseIpc from 'electron-promise-ipc';
import {
  CREATE_RSA_KEYS,
  FILE_ERROR,
  FILE_EXTENSION, FILE_OPEN_FILTER_OPTIONS,
  FILE_READ, FILE_SAVE_FILTER_OPTIONS, FILE_WRITTEN,
  RSA_KEYS_CREATED, SHOW_OPEN_DIALOG,
  SHOW_SAVE_DIALOG,
} from '../../shared/utils/Constants';
import FileManager from '../../shared/classes/FileManager';
import RsaGenerator from '../tasks/RsaGenerator';
import Encryption from '../tasks/Encryption';

export function registerShowOpenDialogEvent() {
  ipcMain.on(SHOW_OPEN_DIALOG, (event, payload) => {
    const window = BrowserWindow.getFocusedWindow();
    const options = {
      filters: FILE_OPEN_FILTER_OPTIONS,
    };

    dialog.showOpenDialog(window, options, (fileNames) => {
      // fileNames is an array that contains all the selected files
      if (fileNames !== undefined) {
        // But we are interested in one only
        const file = fileNames[0];
        FileManager.readFile(file)
          .then((encryptedContent) => {
            const eventName = Encryption.eventNames.decrypt;
            const webContents = Encryption.webContents();
            const privateRsaKey = payload.privateRsaKey;

            return promiseIpc.send(eventName, webContents, encryptedContent, privateRsaKey);
          })
          .then((decryptedContent) => {
            event.sender.send(FILE_READ, decryptedContent);
            return Promise.resolve(true);
          })
          .catch((err) => {
            event.sender.send(FILE_ERROR, err);
          });
      } else {
        event.sender.send(FILE_READ, false);
      }
    });
  });
}

export function registerShowSaveDialogEvent() {
  // eslint-disable-next-line no-unused-vars
  ipcMain.on(SHOW_SAVE_DIALOG, (event, payload) => {
    const window = BrowserWindow.getFocusedWindow();
    const options = {
      filters: FILE_SAVE_FILTER_OPTIONS,
    };

    dialog.showSaveDialog(window, options, (filePath) => {
      // Only work if the file was selected
      if (filePath) {
        filePath = FileManager.appendExtensionToPath(filePath, FILE_EXTENSION);

        const eventName = Encryption.eventNames.encrypt;
        const webContents = Encryption.webContents();
        const content = payload.content;
        const publicRsaKey = payload.publicRsaKey;

        promiseIpc.send(eventName, webContents, content, publicRsaKey)
          .then((encrypted) => {
            FileManager.writeFile(filePath, encrypted);
            return Promise.resolve(true);
          })
          .then(() => {
            // We could write the file
            event.sender.send(FILE_WRITTEN, true);
            return Promise.resolve(true);
          })
          .catch((err) => {
            event.sender.send(FILE_ERROR, err);
          });
      } else {
        // No file was selected
        event.sender.send(FILE_WRITTEN, false);
      }
    });
  });
}

export function registerCreateRsaKeysEvent() {
  // eslint-disable-next-line no-unused-vars
  ipcMain.on(CREATE_RSA_KEYS, (event) => {
    promiseIpc.send(RsaGenerator.eventNames.generate, RsaGenerator.webContents())
      .then((keys) => {
        event.sender.send(RSA_KEYS_CREATED, keys);
      })
      .catch((err) => {
        event.sender.send(FILE_ERROR, err);
      });
  });
}
