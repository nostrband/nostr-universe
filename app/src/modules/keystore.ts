/* eslint-disable */
// @ts-nocheck

import { generatePrivateKey, getEventHash, getPublicKey as getPublicKeyFromPrivateKey, getSignature, nip04 } from "@nostrband/nostr-tools"
import { current } from "@reduxjs/toolkit"

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

let privateKeys = {}
try {
  privateKeys = JSON.parse(window.localStorage.getItem('privateKeys')) || {}
} catch {}

let currentPubkey = '3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd'

const listKeysStub = async () => {
  return {
    currentAlias: currentPubkey,
    ...keys
  }
}

const stub = {
  listKeys: listKeysStub,

  addKey: async function () {
    console.log('ADD KEY')
  },

  generateKey: async function () {
    const key = generatePrivateKey()
    const pk = getPublicKeyFromPrivateKey(key)
    keys[pk] = {
      publicKey: pk,
      name: 'GeneratedKey'
    }
    privateKeys[pk] = key
    try {
      window.localStorage.setItem('privateKeys', JSON.stringify(privateKeys))
    } catch (e) {
      console.log("Failed to write key to localStorage")
    }
    currentPubkey = pk
    console.log('GENERATED KEY', pk)
    return {
      pubKey: pk
    }
  },

  showKey: async function () {
    console.log('SHOW KEY')
  },

  selectKey: async function ({ publicKey }) {
    console.log('selectKey', publicKey)
    currentPubkey = publicKey
    return listKeysStub()
  },

  editKey: async function (info) {
    console.log('EDIT KEY', info)
  },

  getPublicKey: async function () {
    return currentPubkey
  },

  signEvent: async function (event) {
    console.log('signEvent', event)

    const key = privateKeys[currentPubkey]
    if (!key)
      throw new Error('Not implemented')

    const e = { 
      ...event,
      pubkey: currentPubkey
    }
    e.id = getEventHash(e)
    e.sig = getSignature(e, key)
    console.log("signed event", e.id, "pubkey", currentPubkey, "sig", e.sig)
    return e
  },

  encrypt: async function ({ pubkey, plaintext }) {
    console.log('encrypt', pubkey)
    const key = privateKeys[currentPubkey]
    if (!key)
      throw new Error('Not implemented')

    return await nip04.encrypt(key, pubkey, plaintext)
  },

  decrypt: async function ({ pubkey, ciphertext }) {
    console.log('decrypt', pubkey)
    const key = privateKeys[currentPubkey]
    if (!key)
      throw new Error('Not implemented')

    return await nip04.decrypt(key, pubkey, ciphertext)
  }
}

const API = function (method) {
  if (import.meta.env.DEV) {
    return function (...args) {
      return stub[method](...args)
    }
  }

  const target = window.cordova.plugins.NostrKeyStore
  return (...args) => {
    return new Promise((ok, err) => {
      //      console.log("method", method, "args", JSON.stringify([ok, err, ...args]));
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

export async function generateKey() {
  return API('generateKey')()
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

export async function encrypt(pubkey, plaintext) {
  return API('encrypt')({ pubkey, plaintext })
}

export async function decrypt(pubkey, ciphertext) {
  return API('decrypt')({ pubkey, ciphertext })
}

if (import.meta.env.DEV) {
  window.nostr = {
    getPublicKey,
    signEvent,
    nip04: {
      encrypt,
      decrypt
    }
  }
}

export const keystore = {
  listKeys,
  addKey,
  generateKey,
  showKey,
  selectKey,
  editKey,
  getPublicKey,
  signEvent,
  encrypt,
  decrypt
}
