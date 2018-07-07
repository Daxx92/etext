// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron';
import { mergeDeep, getPathFor } from '../../shared/utils/Helpers';

export default class BackgroundTask {
  constructor(file, domReadyEventName, options) {
    this.url = getPathFor(file);

    this.domReadyEventName = domReadyEventName;

    const defaultOptions = {
      height: 40,
      width: 40,
      defaultEncoding: 'utf-8',
      nodeIntegration: false,
      show: false,
    };

    this.options = mergeDeep(defaultOptions, options);
    this.window = null;
  }

  createWindow() {
    // Create window
    this.window = new BrowserWindow(this.options);
    // Load URL
    this.window.loadURL(this.url);
  }

  destroyWindow() {
    if (this.window !== null) {
      this.window.destroy();
      this.window = null;
    }
  }
}
