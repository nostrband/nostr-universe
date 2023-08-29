/* eslint-disable */
// @ts-nocheck
import { dbi } from '@/modules/db'
import { keystore } from '@/modules/keystore'

export const writeCurrentPubkey = async (pubkey: string) => {
  await dbi.setFlag('', 'currentPubkey', pubkey)
}

export const getKeys = async (): Promise<[keys: string[], currentPubkey: string, readKeys: string[]]> => {
  // const list = await keystore.listKeys()
  // const keys = Object.keys(list).filter((key) => key !== 'currentAlias')
  // return [keys, list.currentAlias]

  // can be writeKey or readKey
  let currentPubkey = await dbi.getFlag('', 'currentPubkey')
  console.log('currentPubkey', currentPubkey)

  // write-keys from native plugin
  const list = await keystore.listKeys()
  console.log('listKeys', list)

  // ensure
  if (list.currentAlias && !currentPubkey) {
    await writeCurrentPubkey(list.currentAlias)
    currentPubkey = list.currentAlias
  }

  const writeKeys = Object.keys(list).filter((key) => key !== 'currentAlias')
  const readKeys = (await dbi.listReadOnlyKeys()).filter((k) => !writeKeys.includes(k))

  const keys = [...new Set([...writeKeys, ...readKeys])]
  console.log('load keys cur', currentPubkey, 'writeKeys', writeKeys, 'readKeys', readKeys)

  return [keys, currentPubkey, readKeys]
}
