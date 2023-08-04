import { config } from './config';

const dummy = {
  listKeys: async function () {
    return {currentAlias: "3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd", "3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd": {publicKey: "3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd", name: "main"},"3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bd1": {publicKey: "3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bd1", name: "main1"}};
  },

  addKey: async function () {
    console.log("ADD KEY");
  },

  showKey: async function () {
    console.log("SHOW KEY");
  },

  selectKey: async function (pubkey) {
    console.log("SHOW KEY", pubkey);
    return listKeys();
  },

  editKey: async function (info) {
    console.log("EDIT KEY", info);
  },

  getPublicKey: async function () {
    return listKeys().currentAlias;
  },

  signEvent: async function (event) {
    console.log("signEvent", event);
    throw new Error("Not implemented");
  }, 
};


const API = function (method) {
  if (config.DEBUG)
    return function (...args) { return dummy[method](...args) };

  const target = cordova.plugins.NostrKeyStore;
  return (...args) => {
    return new Promise((ok, err) => {
      target[method](...[ok, err, ...args]);
    });
  };
}

export async function listKeys() {
  return API('listKeys')();
}

export async function addKey() {
  return API('addKey')();
}

export async function showKey(req) {
  return API('showKey')(req);
}

export async function selectKey(req) {
  return API('selectKey')(req);
}

export async function editKey(req) {
  return API('editKey')(req);
}

export async function getPublicKey() {
  return API('getPublicKey')();
}

export async function signEvent(event) {
  return API('signEvent')(event);
}

export const keystore = {
  listKeys,
  addKey,
  showKey,
  selectKey,
  editKey,
  getPublicKey,
  signEvent,
};
