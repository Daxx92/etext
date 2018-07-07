import jetpack from 'fs-jetpack';

export default class FileManager {
  constructor() {
    this.error = null;
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
