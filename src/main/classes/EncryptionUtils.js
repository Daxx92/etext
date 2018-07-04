import crypto2 from 'crypto2';

export default class EncryptionUtils {
  constructor() {
    this.error = null;
  }

  static async encrypt(content, publicRsaKey) {
    return this.randomPassphrase()
      .then(passphrase => Promise.all([
        // Create Password from passphrase
        crypto2.createPassword(passphrase),
        // Create random iv
        crypto2.createIv(),
      ]))
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
    const rsaDecrypted = await this.decryptRSA(rsaEncrypted, privateRsaKey)
    // Catch the error
      .catch(reason => // eslint-disable-line no-unused-vars
        Promise.reject('Could not decrypt file. Double check rsa keys and file format.'),
      );

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

  static async createRSAKeys() {
    const { privateKey, publicKey } = await crypto2.createKeyPair();

    return {
      privateRsaKey: privateKey,
      publicRsaKey: publicKey,
    };
  }

  static async randomPassphrase() {
    return Promise.all([
      // Create a triple IV which will work as a passphrase
      crypto2.createIv(),
      crypto2.createIv(),
      crypto2.createIv(),
    ])
      .then((data) => {
        const [p1, p2, p3] = data;
        return `${p1}-${p2}-${p3}`;
      });
  }
}
