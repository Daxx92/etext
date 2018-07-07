import BackgroundTask from './BackgroundTask';

const HTML_FILE = 'rsa-generator.html';
const OPTIONS = {
  height: 600,
  width: 400,
  defaultEncoding: 'utf-8',
  nodeIntegration: false,
  show: true,
};
const DOM_READY_EVENT_NAME = 'rsa.ready';

export default new BackgroundTask(HTML_FILE, DOM_READY_EVENT_NAME, OPTIONS);
