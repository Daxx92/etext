// eslint-disable-next-line import/no-extraneous-dependencies
import promiseIpc from 'electron-promise-ipc';
import EncryptionUtils from '../../shared/classes/EncryptionUtils';
import Encryption from '../../main/tasks/Encryption';

// eslint-disable-next-line max-len
promiseIpc.on(Encryption.eventNames.encrypt, (content, publicKey) => EncryptionUtils.encrypt(content, publicKey));

// eslint-disable-next-line max-len
promiseIpc.on(Encryption.eventNames.decrypt, (content, privateKey) => EncryptionUtils.decrypt(content, privateKey));

