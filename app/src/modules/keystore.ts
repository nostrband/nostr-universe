/* eslint-disable */
// @ts-nocheck

const keys = {
  '3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd': {
    publicKey: '3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd',
    name: 'brugeman'
  },
  '3f770d65d3a764a9c5cb503ae123e62ec7598ad035d836e2a810f3877a745b24': {
    publicKey: '3f770d65d3a764a9c5cb503ae123e62ec7598ad035d836e2a810f3877a745b24',
    name: 'DerekRoss'
  },
  '460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c': {
    publicKey: '460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c',
    name: 'Vitor Pamplona'
  },
  eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f: {
    publicKey: 'eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f',
    name: 'Lyn Alren'
  },
  '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2': {
    publicKey: '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
    name: 'Jack'
  }
}

let currentPubkey = '3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd'

const listKeysStub = () => {
  return {
    currentAlias: currentPubkey,
    ...keys
  }
}

const dummy = {
  listKeys: listKeysStub,

  addKey: async function () {
    console.log('ADD KEY')
  },

  showKey: async function () {
    console.log('SHOW KEY')
  },

  selectKey: async function (pubkey) {
    console.log('SHOW KEY', pubkey)
    return listKeys()
  },

  editKey: async function (info) {
    console.log('EDIT KEY', info)
  },

  getPublicKey: async function () {
    return listKeys().currentAlias
  },

  signEvent: async function (event) {
    console.log('signEvent', event)
    throw new Error('Not implemented')
  }
}

const API = function (method) {
  if (import.meta.env.DEV)
    return function (...args) {
      return dummy[method](...args)
    }

  const target = cordova.plugins.NostrKeyStore
  return (...args) => {
    return new Promise((ok, err) => {
      target[method](...[ok, err, ...args])
    })
  }
}

export async function listKeys() {
  return API('listKeys')()
}

export async function addKey() {
  return API('addKey')()
}

export async function showKey(req) {
  return API('showKey')(req)
}

export async function selectKey(req) {
  return API('selectKey')(req)
}

export async function editKey(req) {
  return API('editKey')(req)
}

export async function getPublicKey() {
  return API('getPublicKey')()
}

export async function signEvent(event) {
  return API('signEvent')(event)
}

export const keystore = {
  listKeys,
  addKey,
  showKey,
  selectKey,
  editKey,
  getPublicKey,
  signEvent
}
