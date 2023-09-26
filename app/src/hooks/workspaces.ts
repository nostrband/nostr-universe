import { keystore } from '@/modules/keystore'
import { loadKeys, loadWorkspace, writeCurrentPubkey } from '@/modules/AppInitialisation/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { DEFAULT_PUBKEY } from '@/consts'
import { db } from '@/modules/db'
import { updateWorkspacePubkey } from '@/store/reducers/workspaces.slice'
import { useUpdateProfile } from '@/hooks/profile'

export const useAddKey = () => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const wasPubkey = useAppSelector((state) => state.keys).currentPubkey
  const wasGuest = wasPubkey === DEFAULT_PUBKEY

  const addKey = async () => {

    // ask user for new key
    const r = await keystore.addKey()

    // write to db
    writeCurrentPubkey(r.pubkey)

    // reload keys
    const [keys, currentPubkey] = await loadKeys(dispatch)

    if (wasGuest) {
      await db.tabs.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey: currentPubkey })
      await db.pins.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey: currentPubkey })

      dispatch(updateWorkspacePubkey({
        workspacePubkey: wasPubkey,
        pubkey: currentPubkey
      }))
    } else {

      // read workspace from db
      await loadWorkspace(currentPubkey, dispatch)
    }

    // load info on this new key
    await updateProfile(keys, currentPubkey)
  }

  return {
    addKey
  }
}

export const useChangeAccount = () => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const { currentPubkey: currentPubKey, readKeys } = useAppSelector((state) => state.keys)

  const changeAccount = async (publicKey: string) => {
    if (!readKeys.includes(publicKey)) {
      await keystore.selectKey({ publicKey })
    }

    await writeCurrentPubkey(publicKey)

    if (publicKey !== currentPubKey) {
      const [keys, pubkey] = await loadKeys(dispatch)
      updateProfile(keys, pubkey)
    }
  }

  return {
    changeAccount
  }
}
