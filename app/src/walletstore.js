import { config } from './config';

const stub = {
};

const API = function (method) {
  if (config.DEBUG)
    return function (...args) { return stub[method](...args) };

  const target = window.cordova.plugins.NostrWalletStore;
  return (...args) => {
    return new Promise((ok, err) => {
//      console.log("method", method, "args", JSON.stringify([...args]));
      target[method](...[ok, err, ...args]);
    });
  };
}

export async function listWallets() {
  return API('listWallets')();
}

export async function addWallet() {
  return API('addWallet')();
}

export async function deleteWallet(id) {
  return API('deleteWallet')({ id });
}

export async function selectWallet(id) {
  return API('selectWallet')({ id });
}

export async function getInfo() {
  return API('getInfo')();
}

export async function signEvent(event) {
  return API('signEvent')(event);
}

export async function encrypt(pubkey, plaintext) {
  return API('encryptData')({pubkey, plaintext});
}

export async function decrypt(pubkey, ciphertext) {
  return API('decryptData')({pubkey, ciphertext});
}

export const walletstore = {
  listWallets,
  addWallet,
  deleteWallet,
  selectWallet,
  getInfo,
  signEvent,
  encrypt,
  decrypt,
};
