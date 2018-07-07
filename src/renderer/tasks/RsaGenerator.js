// eslint-disable-next-line import/no-extraneous-dependencies
import promiseIpc from 'electron-promise-ipc';
import EncryptionUtils from '../../shared/classes/EncryptionUtils';

// eslint-disable-next-line no-unused-vars
promiseIpc.on('rsa.generate', event => EncryptionUtils.createRSAKeys());
