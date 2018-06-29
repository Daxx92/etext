import jetpack from 'fs-jetpack';
import EncryptionUtils from './EncryptionUtils';

export default class FileManager {
  constructor() {
    this.error = null;
  }

  static async encryptContent(content, passphrase, publicRsaKey) {
    return EncryptionUtils.encrypt(content, passphrase, publicRsaKey);
  }

  static async decryptContent(content, privateRsaKey) {
    return EncryptionUtils.decrypt(content, privateRsaKey);
  }

  static readFile(filePath) {
    return jetpack.readAsync(filePath, 'utf8');
  }

  static writeFile(filePath, content) {
    return jetpack.writeAsync(filePath, content, { atomic: true });
  }

  static appendExtensionToPath(filePath, extension) {
    if (!filePath.endsWith(extension)) {
      return `${filePath}${extension}`;
    }

    return filePath;
  }
}
