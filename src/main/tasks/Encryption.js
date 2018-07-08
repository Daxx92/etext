import BackgroundTask from './BackgroundTask';

const HTML_FILE = 'encryption.html';
const OPTIONS = {}; // Default values are Ok
const DOM_READY_EVENT_NAME = 'encryption.ready';

const EVENT_NAMES = Object.freeze({
  encrypt: 'encryption.encrypt',
  decrypt: 'encryption.decrypt',
});

export default new BackgroundTask(HTML_FILE, DOM_READY_EVENT_NAME, EVENT_NAMES, OPTIONS);
