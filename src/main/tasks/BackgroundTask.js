// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron';
import { mergeDeep, getPathFor } from '../../shared/utils/Helpers';

export default class BackgroundTask {
  constructor(file, domReadyEventName, eventNames, options) {
    // Variables
    const show = process.env.SHOW_BACKGROUND_TASK_WINDOWS === '1';
    const defaultOptions = {
      width: 400,
      height: 200,
      defaultEncoding: 'utf-8',
      nodeIntegration: false,
      show,
    };

    // Set fields
    this.url = getPathFor(file);
    this.domReadyEventName = domReadyEventName;
    this.eventNames = eventNames;
    this.options = mergeDeep(defaultOptions, options);
    this.window = null;
  }

  windowExists() {
    return this.window !== null;
  }

  webContents() {
    return this.windowExists() ? this.window.webContents : null;
  }

  createWindow() {
    // Create window
    this.window = new BrowserWindow(this.options);
    // Load URL
    this.window.loadURL(this.url);
  }

  destroyWindow() {
    if (this.windowExists()) {
      this.window.destroy();
      this.window = null;
    }
  }
}
