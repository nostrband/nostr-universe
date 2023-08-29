import { keystore } from '@/modules/keystore'
import { addWorkspace } from '@/modules/AppInitialisation/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setCurrentPubKey, setKeys, setReadKeys } from '@/store/reducers/keys.slice'
import { DEFAULT_PUBKEY } from '@/consts'
import { db } from '@/modules/db'
import { setCurrentWorkspace, setWorkspaces } from '@/store/reducers/workspaces.slice'
import { useUpdateProfile } from '@/hooks/profile'
import { WorkSpace } from '@/types/workspace'
import { writeCurrentPubkey, getKeys } from '@/utils/keys'

const updateWorkspace = (workspaces: WorkSpace[], cbProps: { pubkey: string }, pubkey: string) => {
  const updateWorkspaces = workspaces.map((workspace) =>
    workspace.pubkey === pubkey ? { ...workspace, ...cbProps } : workspace
  )

  return updateWorkspaces
}

export const useAddKey = () => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const { workspaces } = useAppSelector((state) => state.workspaces)

  const addKey = async () => {
    await keystore.addKey()

    const [keys, currentPubKey, readKeys] = await getKeys()

    dispatch(setKeys({ keys }))
    dispatch(setCurrentPubKey({ currentPubKey }))
    dispatch(setReadKeys({ readKeys }))

    if (currentPubKey === DEFAULT_PUBKEY) {
      await db.tabs.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey: currentPubKey })
      await db.pins.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey: currentPubKey })

      const w = updateWorkspace(workspaces, { pubkey: currentPubKey }, DEFAULT_PUBKEY)

      dispatch(
        setWorkspaces({
          workspaces: w
        })
      )
    } else {
      const workspace = await addWorkspace(currentPubKey)

      dispatch(setWorkspaces({ workspaces: [workspace] }))
    }

    await updateProfile(keys, currentPubKey)
  }

  return {
    addKey
  }
}

export const useChangeAccount = () => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const { currentPubKey } = useAppSelector((state) => state.keys)

  const changeAccount = async (publicKey: string) => {
    await writeCurrentPubkey(publicKey)

    if (publicKey !== currentPubKey) {
      const [keys, pubkey] = await getKeys()
      dispatch(setKeys({ keys }))
      dispatch(setCurrentPubKey({ currentPubKey: pubkey }))

      dispatch(setCurrentWorkspace({ currentPubKey: pubkey }))

      updateProfile(keys, pubkey)
    }
  }

  return {
    changeAccount
  }
}
