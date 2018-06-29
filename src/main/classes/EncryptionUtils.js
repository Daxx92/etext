import crypto2 from 'crypto2';

export default class FileManager {
  constructor() {
    this.error = null;
  }

  static async encrypt(content, passphrase, publicRsaKey) {
    return Promise.all([
      // Create Password from passphrase
      crypto2.createPassword(passphrase),
      // Create random iv
      crypto2.createIv(),
    ])
      .then((data) => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Basic_variable_assignment
        const [password, iv] = data;

        return Promise.all([
          // Encrypt params with RSA
          this.encryptRSA(`${password}&${iv}`, publicRsaKey),
          // Encrypt content with AES
          crypto2.encrypt(content, password, iv),
        ]);
      })
      .then((data) => {
        const [encParams, encrypted] = data;

        return `${encParams}:${encrypted}`;
      });
  }

  static async decrypt(content, privateRsaKey) {
    const splitPos = content.indexOf(':');
    const rsaEncrypted = content.substr(0, splitPos);
    const rsaDecrypted = await this.decryptRSA(rsaEncrypted, privateRsaKey);

    const encrypted = content.substr(splitPos + 1);
    const password = rsaDecrypted.substr(0, rsaDecrypted.indexOf('&'));
    const iv = rsaDecrypted.substring(rsaDecrypted.indexOf('&') + 1);

    return crypto2.decrypt(encrypted, password, iv);
  }

  static async encryptRSA(content, publicKey) {
    // const key = await crypto2.readPublicKey(publicKey);
    return crypto2.encrypt.rsa(content, publicKey);
  }

  static async decryptRSA(encrypted, privateKey) {
    // const key = await crypto2.readPrivateKey(privateKey);
    return crypto2.decrypt.rsa(encrypted, privateKey);
  }
}
