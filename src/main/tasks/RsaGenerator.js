// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron';

const HTML_FILE = 'rsa-generator.html';

const rsaGenerator = {
  // eslint-disable-next-line no-use-before-define
  createWindow,
  // eslint-disable-next-line no-use-before-define
  close,
  win: null,
};

const url = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/${HTML_FILE}`
  : `file://${__dirname}/${HTML_FILE}`;

function createWindow() {
  /**
     * Initial window options
     */
  rsaGenerator.win = new BrowserWindow({
    height: 400,
    width: 400,
    defaultEncoding: 'utf-8',
    nodeIntegration: false,
    // show: false,
  });

  rsaGenerator.win.loadURL(url);

  return rsaGenerator.win;
}

function close() {
  if (rsaGenerator.win !== null) {
    rsaGenerator.win.close();
    rsaGenerator.win = null;
  }
}


export default rsaGenerator;
