import jetpack from 'fs-jetpack';
import crypto2 from 'crypto2';

export default class FileManager {
  constructor() {
    this.error = null;
  }

  static async encryptContent(content, passphrase) {
    const [password, iv] = await Promise.all([
      crypto2.createPassword(passphrase),
      crypto2.createIv(),
    ]);

    const encrypted = await crypto2.encrypt(content, password, iv);
    const encData = `${password}&${iv}`;

    return `${encData}:${encrypted}`;
  }

  static async decryptContent(content) {
    // Extract the iv from the file
    const splitPos = content.indexOf(':');
    const data = content.substr(0, splitPos);

    const encrypted = content.substr(splitPos + 1);
    const password = data.substr(0, data.indexOf('&'));
    const iv = data.substring(data.indexOf('&') + 1);

    return crypto2.decrypt(encrypted, password, iv);
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
