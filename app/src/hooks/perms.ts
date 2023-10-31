import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { dbi } from '@/modules/db'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import {
  deletePermissionRequest,
  setPermissionRequest,
  setPermissionRequestProcessing
} from '@/store/reducers/permissionRequests.slice'
import { deletePermWorkspace, setPermsWorkspace } from '@/store/reducers/workspaces.slice'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ITab } from '@/types/tab'
import { useOpenModalSearchParams } from './modal'
import { v4 as uuidv4 } from 'uuid'

export const usePerms = () => {
  const dispatch = useAppDispatch()
  const { tabs, currentTabId } = useAppSelector((state) => state.tab)
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { permissionRequests } = useAppSelector((state) => state.permissionRequests)
  const { handleOpen } = useOpenModalSearchParams()
  const { currentPubkey } = useAppSelector((state) => state.keys)

  const getTabAny = (id: string) => tabs.find((t) => t.id === id)

  const hasPerm = (tab: ITab, name: string, value: string) => {
    const app = getTabGroupId(tab)
    const ws = workspaces.find((ws) => ws.pubkey === tab.pubkey)
    const perm = ws?.perms.find((p) => p.app === app && p.name === name)?.value === value
    return perm
  }

  const replyCurrentPermRequest = async (allow: boolean, remember: boolean, currentPermId: string) => {
    const currentPermRequest = permissionRequests.find((perm) => perm.id === currentPermId)
    if (!currentPermRequest) throw new Error('No current perm request')
    const tab = getTabAny(currentPermRequest.tabId)
    if (!tab) throw new Error('Perm request tab not found')

    // mark as active
    dispatch(setPermissionRequestProcessing({ id: currentPermRequest.id }))

    console.log('replyCurrentPermRequest', allow, remember, JSON.stringify(currentPermRequest))
    if (remember) {
      const perm = {
        pubkey: tab.pubkey,
        app: getTabGroupId(tab),
        name: currentPermRequest.perm,
        value: allow ? '1' : '0'
      }

      dispatch(setPermsWorkspace({ perm, workspacePubkey: tab.pubkey }))

      console.log('adding perm', JSON.stringify(perm))
      dbi.updatePerm(perm)
    }

    // execute
    try {
      await currentPermRequest.cb(allow)
    } catch (e) {
      console.log('Failed to exec perm callback', e)
    }

    // drop executed request
    const i = permissionRequests.findIndex((pr) => pr.id === currentPermRequest.id)

    if (i >= 0) {
      dispatch(deletePermissionRequest({ id: currentPermRequest.id }))
    } else {
      throw new Error('Perm request not found')
    }

    // more reqs?
    const reqs = permissionRequests.filter((pr) => pr.tabId === currentPermRequest.tabId)
    if (reqs.length > 1) {
      handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_REQ, { search: { permId: reqs[1].id } })
    }
  }

  const requestPerm = (
    tab: ITab,
    // eslint-disable-next-line
    req: any,
    cb: (allow: boolean) => void
  ) => {
    const r = {
      ...req,
      id: uuidv4(),
      tabId: tab.id,
      cb
    }

    dispatch(setPermissionRequest({ permissionRequest: r }))

    console.log(
      'perm request',
      tab.id,
      'currentTabId',
      currentTabId,
      JSON.stringify(r),
      JSON.stringify(permissionRequests)
    )
    if (currentTabId === tab.id && !permissionRequests.find((perm) => tab.id === perm.tabId)) {
      // permRequests.current.length === 1
      console.log('show perm request modal', r.id)
      handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_REQ, { search: { permId: r.id } })
      // show request perm modal right now
      // setCurrentPermRequest(r)
      // console.log(JSON.stringify({ permissions: refPermissionReq.current }))
    }
  }

  const showPendingPermRequest = (tabId: string) => {
    const r = permissionRequests.find((perm) => tabId === perm.tabId)
    if (!r || r.processing) return

    console.log('show pending perm request modal', r.id)
    handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_REQ, { search: { permId: r.id } })
  }

  // eslint-disable-next-line
  const requestPermExec = (tab: ITab, perm: any, exec: () => any, error: any) => {
    return new Promise((ok, err) => {
      requestPerm(tab, perm, async (allowed) => {
        try {
          if (allowed) ok(await exec())
          else err(error)
        } catch (e) {
          err(e)
        }
      })
    })
  }

  const deletePermission = async (id: string) => {
    dispatch(deletePermWorkspace({ id, workspacePubkey: currentPubkey }))

    dbi.deletePerms(currentPubkey, id)
  }

  return {
    hasPerm,
    showPendingPermRequest,
    requestPermExec,
    replyCurrentPermRequest,
    deletePermission
  }
}
