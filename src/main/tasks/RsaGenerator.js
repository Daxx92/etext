import BackgroundTask from './BackgroundTask';

const HTML_FILE = 'rsa-generator.html';
const OPTIONS = {}; // Default values are Ok
const DOM_READY_EVENT_NAME = 'rsa.ready';

const EVENT_NAMES = Object.freeze({
  generate: 'rsa.generate',
  generated: 'rsa.generated',
});

export default new BackgroundTask(HTML_FILE, DOM_READY_EVENT_NAME, EVENT_NAMES, OPTIONS);
