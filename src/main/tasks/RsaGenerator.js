import BackgroundTask from './BackgroundTask';

const HTML_FILE = 'rsa-generator.html';
const OPTIONS = {}; // Default values are Ok
const DOM_READY_EVENT_NAME = 'rsa.ready';

export default new BackgroundTask(HTML_FILE, DOM_READY_EVENT_NAME, OPTIONS);
