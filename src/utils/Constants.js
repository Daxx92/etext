export const FILE_EXTENSION = '.etmd';
export const FILE_OPEN_FILTER_OPTIONS = [
  { name: 'Encrypted MD', extensions: ['etmd'] },
  { name: 'OLD Encrypted MD', extensions: ['emd'] },
];
export const FILE_SAVE_FILTER_OPTIONS = [
  FILE_OPEN_FILTER_OPTIONS[0], // Old format is not supported
];


export const CREATE_RSA_KEYS = 'CREATE_RSA_KEYS';
export const RSA_KEYS_CREATED = 'RSA_KEYS_CREATED';

export const SHOW_OPEN_DIALOG = 'SHOW_OPEN_DIALOG';
export const SHOW_SAVE_DIALOG = 'SHOW_SAVE_DIALOG';
export const FILE_READ = 'FILE_READ';
export const FILE_WRITTEN = 'FILE_WRITTEN';
export const FILE_ERROR = 'FILE_ERROR';
