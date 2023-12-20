const Cryptr = require("cryptr");
const CryptoJS = require("crypto-js");

const decrypt = (cipher) => {
  const secrateKey = process.env.DECRYPT;
  const cryptr = new Cryptr(secrateKey);

  const decryptedString = cryptr.decrypt(cipher);
  return decryptedString;
};

// const decrypt = (cipher) => {
//   const secrateKey = process.env.DECRYPT;
//   const byte = CryptoJS.AES.decrypt(cipher, secrateKey).toString();
//   if (byte.toString()) {
//     return JSON.parse(byte.toString(CryptoJS.enc.Utf8));
//   }
// };

module.exports = decrypt;
