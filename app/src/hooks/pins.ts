import { dbi } from '@/modules/db'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import {
  removePinWorkspace,
  addPinWorkspace,
  updatePinWorkspace
} from '@/store/reducers/workspaces.slice'
import { AppNostr } from '@/types/app-nostr'
import { v4 as uuidv4 } from 'uuid'
import { AppHandlerEvent } from '@/modules/nostr'
import { ITab } from '@/types/tab'
import { selectCurrentWorkspace } from '@/store/store'
import { IPin, WorkSpace } from '@/types/workspace'
import { useCallback } from 'react'

export const usePins = () => {
  const dispatch = useAppDispatch()
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const onPinApp = useCallback(async (app: AppNostr) => {
    if (!currentWorkspace) return

    const pin: IPin = {
      id: uuidv4(),
      url: app.url,
      appNaddr: app.naddr,
      title: app?.name, // FIXME why there title instead name?
      icon: app.picture,
      order: currentWorkspace.pins.length,
      pubkey: currentWorkspace.pubkey || '',
    }

    dispatch(addPinWorkspace({ pin, workspacePubkey: currentWorkspace.pubkey }))

    dbi.addPin(pin)
  }, [dispatch, currentWorkspace])

  const onPinTab = useCallback(async (currentTab: ITab) => {
    if (!currentWorkspace) return
    const pin: IPin = {
      id: uuidv4(),
      url: currentTab.url,
      title: currentTab.title,
      icon: currentTab.icon,
      order: currentWorkspace.pins.length,
      pubkey: currentTab.pubkey
    }

    dispatch(addPinWorkspace({ pin, workspacePubkey: currentTab.pubkey }))

    dbi.addPin(pin)
  }, [dispatch, currentWorkspace])

  const findTabPin = useCallback((tab: ITab): IPin | undefined => {
    const ws = workspaces.find((ws: WorkSpace) => ws.pubkey === tab.pubkey)
    return ws?.pins.find(
      (p) => p.url === tab.url // p.appNaddr === tab.appNaddr ||
    )
  }, [workspaces])

  const findAppPin = useCallback((app: AppHandlerEvent): IPin | undefined => {
    return currentWorkspace?.pins.find(
      (p) => p.appNaddr === app.naddr
        || app.eventUrl?.startsWith(p.url)
    )
  }, [currentWorkspace])

  const onUnPinTab = useCallback(async (currentTab: ITab) => {
    const pin = findTabPin(currentTab)
    if (!pin) return
    dispatch(removePinWorkspace({ id: pin.id, workspacePubkey: currentTab.pubkey }))
    dbi.deletePin(pin.id)
  }, [findTabPin, dispatch])

  const onDeletePinnedApp = useCallback(async (currentPin: IPin) => {
    dispatch(removePinWorkspace({ id: currentPin.id, workspacePubkey: currentPin.pubkey }))
    dbi.deletePin(currentPin.id)
  }, [dispatch])

  const onUpdatePinnedApp = useCallback(async (currentPin: IPin) => {
    dispatch(updatePinWorkspace({ pin: currentPin, workspacePubkey: currentPin.pubkey }))
    dbi.updatePin(currentPin)
  }, [dispatch])

  return {
    onPinApp,
    onPinTab,
    onUnPinTab,
    findTabPin,
    findAppPin,
    onDeletePinnedApp,
    onUpdatePinnedApp,
  }
}
