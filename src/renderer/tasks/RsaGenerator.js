// eslint-disable-next-line import/no-extraneous-dependencies
import promiseIpc from 'electron-promise-ipc';
import EncryptionUtils from '../../shared/classes/EncryptionUtils';
import RsaGenerator from '../../main/tasks/RsaGenerator';

// eslint-disable-next-line no-unused-vars
promiseIpc.on(RsaGenerator.eventNames.generate, event => EncryptionUtils.createRSAKeys());
