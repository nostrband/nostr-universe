import { dbi } from '@/modules/db'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { removePinWorkspace, addPinWorkspace, updatePinWorkspace } from '@/store/reducers/workspaces.slice'
import { AppNostr } from '@/types/app-nostr'
import { v4 as uuidv4 } from 'uuid'
import { ITab } from '@/types/tab'
import { selectCurrentWorkspace } from '@/store/store'
import { IPin, WorkSpace } from '@/types/workspace'
import { useCallback } from 'react'
import { AppEvent } from '@/types/app-event'

export const usePins = () => {
  const dispatch = useAppDispatch()
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const onPinApp = useCallback(
    async (app: AppNostr) => {
      if (!currentWorkspace) return

      const pin: IPin = {
        id: uuidv4(),
        url: app.url,
        appNaddr: app.naddr,
        title: app?.name, // FIXME why there title instead name?
        icon: app.picture,
        order: currentWorkspace.pins.length,
        pubkey: currentWorkspace.pubkey || ''
      }

      dispatch(addPinWorkspace({ pin, workspacePubkey: currentWorkspace.pubkey }))

      dbi.addPin(pin)
    },
    [dispatch, currentWorkspace]
  )

  const onPinTab = useCallback(
    async (currentTab: ITab) => {
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
    },
    [dispatch, currentWorkspace]
  )

  const findTabPin = useCallback(
    (tab: ITab): IPin | undefined => {
      const ws = workspaces.find((ws: WorkSpace) => ws.pubkey === tab.pubkey)
      return ws?.pins.find(
        (p) => p.url === tab.url // p.appNaddr === tab.appNaddr ||
      )
    },
    [workspaces]
  )

  const findAppPin = useCallback((app: AppEvent): IPin | undefined => {
    return currentWorkspace?.pins.find(
      (p) => p.appNaddr === app.naddr
        || p.url === app.meta?.website
    )
  }, [currentWorkspace])

  const onDeletePinnedApp = useCallback(async (currentPin: IPin) => {
    dispatch(removePinWorkspace({ id: currentPin.id, workspacePubkey: currentPin.pubkey }))
    dbi.deletePin(currentPin.id)
  }, [dispatch])

  const onUnPinTab = useCallback(async (currentTab: ITab) => {
    const pin = findTabPin(currentTab)
    if (pin) onDeletePinnedApp(pin)
  }, [findTabPin, onDeletePinnedApp])

  const onUpdatePinnedApp = useCallback(
    async (currentPin: IPin) => {
      dispatch(updatePinWorkspace({ pin: currentPin, workspacePubkey: currentPin.pubkey }))
      dbi.updatePin(currentPin)
    },
    [dispatch]
  )

  return {
    onPinApp,
    onPinTab,
    onUnPinTab,
    findTabPin,
    findAppPin,
    onDeletePinnedApp,
    onUpdatePinnedApp
  }
}
