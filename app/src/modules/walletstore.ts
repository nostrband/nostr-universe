/* eslint-disable */
// @ts-nocheck

const wallets = {
  'id1': {
    id: 'id1',
    publicKey: '3156de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd',
    relay: 'wss://nostr.mutinywallet.com'
  },
  'id2': {
    id: 'id2',
    publicKey: '32770d65d3a764a9c5cb503ae123e62ec7598ad035d836e2a810f3877a745b24',
    relay: 'wss://relay.getalby.com'
  }
}

let currentWallet = 'id1'

const listWalletsStub = async () => {
  return {
    currentAlias: currentWallet,
    ...keys
  }
}


const stub = {
  listWallets: listWalletsStub,

  addWallet: () => {
    console.log("wallet add")
  },

  deleteWallet: (id) => {
    console.log("wallet delete", id)
  },

  selectWallet: (id) => {
    console.log("wallet select", id)
    currentWallet = id
    return listWalletsStub()
  },

  getInfo: () => {
    return wallets[currentWallet]
  },

  signEvent: async (event) => {
    console.log("wallet sign ", event)
  },

  encrypt: async (pubkey, plaintext) => {
    console.log("wallet encrypt", pubkey, plaintext)
  },

  decrypt: async (pubkey, ciphertext) => {
    console.log("wallet decrypt", pubkey, ciphertext)
  },

}

const API = function (method) {
  if (import.meta.env.DEV)
    return function (...args) {
      return stub[method](...args)
    }

  const target = window.cordova.plugins.NostrWalletStore
  return (...args) => {
    return new Promise((ok, err) => {
      //      console.log("method", method, "args", JSON.stringify([...args]));
      target[method](...[ok, err, ...args])
    })
  }
}

export async function listWallets() {
  return API('listWallets')()
}

export async function addWallet() {
  return API('addWallet')()
}

export async function deleteWallet(id) {
  return API('deleteWallet')({ id })
}

export async function selectWallet(id) {
  return API('selectWallet')({ id })
}

export async function getInfo() {
  return API('getInfo')()
}

export async function signEvent(event) {
  return API('signEvent')(event)
}

export async function encrypt(pubkey, plaintext) {
  return API('encryptData')({ pubkey, plaintext })
}

export async function decrypt(pubkey, ciphertext) {
  return API('decryptData')({ pubkey, ciphertext })
}

export const walletstore = {
  listWallets,
  addWallet,
  deleteWallet,
  selectWallet,
  getInfo,
  signEvent,
  encrypt,
  decrypt
}
