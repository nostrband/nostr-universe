import { keystore } from '@/modules/keystore'
import { loadKeys, loadWorkspace, writeCurrentPubkey } from '@/modules/AppInitialisation/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { DEFAULT_PUBKEY } from '@/consts'
import { db, dbi } from '@/modules/db'
import { updateWorkspacePubkey } from '@/store/reducers/workspaces.slice'
import { useUpdateProfile } from '@/hooks/profile'
import { nip19 } from '@nostrband/nostr-tools'
import { showToast } from '@/utils/helpers/general'
import { checkNsbSigner } from '@/modules/nostr'
import { useCallback } from 'react'
//import { checkNsbSigner, setNsbSigner } from '@/modules/nostr'

export const useAddKey = () => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const { keys, currentPubkey: wasPubkey } = useAppSelector((state) => state.keys)

  const setPubkey = useCallback(
    async (pubkey: string) => {
      const wasGuest = wasPubkey === DEFAULT_PUBKEY

      // write to db, has to await to make sure loadKeys reads it
      await writeCurrentPubkey(pubkey)

      // reload keys
      const [keys, currentPubkey] = await loadKeys(dispatch)

      if (wasGuest) {
        // reassign guest pins and tabs to this new workspace
        await db.tabs.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey: currentPubkey })
        await db.pins.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey: currentPubkey })

        // avoid double-init
        await dbi.setFlag(currentPubkey, 'bootstrapped', true)

        dispatch(
          updateWorkspacePubkey({
            workspacePubkey: wasPubkey,
            pubkey: currentPubkey
          })
        )
      } else {
        // read workspace from db
        await loadWorkspace(currentPubkey, dispatch)
      }

      // load info on this new key
      await updateProfile(keys, currentPubkey)
    },
    [wasPubkey, updateProfile, dispatch]
  )

  const addKey = useCallback(async () => {
    try {
      // ask user for new key
      const r = await keystore.addKey()
      console.log('addKey', JSON.stringify(r))
      await setPubkey(r.pubKey)
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      showToast(`Error: ${e}`)
    }
  }, [setPubkey])

  const addReadOnlyKey = useCallback(
    async (pubkey: string) => {
      await dbi.putReadOnlyKey(pubkey)
      await setPubkey(pubkey)
    },
    [setPubkey]
  )

  const addNSBKey = useCallback(
    async (token: string) => {
      let pubkey = ''
      try {
        const npub = token.includes('#') ? token.split('#')[0] : token
        const { type, data } = nip19.decode(npub)
        if (type !== 'npub') throw new Error('Bad npub or token')

        pubkey = data
      } catch (e) {
        showToast(`Error: ${e}`)
        return
      }
      console.log('nsb pubkey', pubkey)

      if (keys.includes(pubkey)) {
        showToast(`Key already exists!`)
        return
      }

      let localPubkey = ''
      try {
        const r = await keystore.generateKey()
        console.log('generateKey', JSON.stringify(r))
        localPubkey = r.pubKey
      } catch (e) {
        console.log('generatekey error ', e)
        showToast(`Error: ${e}`)
        return
      }
      console.log('localPubkey', localPubkey)

      // write to db
      await dbi.addNsecBunkerKey({
        pubkey,
        localPubkey,
        token
      })

      await setPubkey(pubkey)

      showToast('Authorize in NsecBunker')

      // launch a connection check
      checkNsbSigner()
        .then(() => {
          showToast('NsecBunker connected!')
        })
        .catch((e) => {
          console.log('nsb error', e)
          showToast('NsecBunker error!')
        })
    },
    [setPubkey]
  )

  return {
    addKey,
    addReadOnlyKey,
    addNSBKey
  }
}

export const useChangeAccount = () => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const { currentPubkey, readKeys, nsbKeys } = useAppSelector((state) => state.keys)

  const changeAccount = async (publicKey: string) => {
    if (nsbKeys.includes(publicKey)) {
      const localPubkey = await dbi.getNsecBunkerLocalPubkey(publicKey)
      if (localPubkey) await keystore.selectKey({ publicKey: localPubkey })
      else throw new Error(`No local pubkey for ${publicKey}`)
    } else if (!readKeys.includes(publicKey)) {
      await keystore.selectKey({ publicKey })
    }

    await writeCurrentPubkey(publicKey)

    if (publicKey !== currentPubkey) {
      const [keys, pubkey] = await loadKeys(dispatch)
      updateProfile(keys, pubkey)
    }
  }

  return {
    changeAccount
  }
}
