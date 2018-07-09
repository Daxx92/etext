import BackgroundTask from './tasks/BackgroundTask';

const HTML_FILE = 'splash-screen.html';
const OPTIONS = {
  height: 100,
  width: 300,
  frame: false,
  center: true,
};
const DOM_READY_EVENT_NAME = 'splash-screen.ready';

const EVENT_NAMES = Object.freeze({});

export default new BackgroundTask(HTML_FILE, DOM_READY_EVENT_NAME, EVENT_NAMES, OPTIONS);
