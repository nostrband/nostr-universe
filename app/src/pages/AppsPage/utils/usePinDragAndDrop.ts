import { useCallback, useState } from 'react'
import { checkIsGroupType, getDefaultGroupName } from './helpers'
import { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { IPin } from '@/types/workspace'
import { AppNostr } from '@/types/app-nostr'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { bulkEditPinsWorkspace, swapPins } from '@/store/reducers/workspaces.slice'
import { selectCurrentWorkspace } from '@/store/store'

export type GroupedPin = IPin & { pins?: IPin[] }
type PinID = string | number

export const usePinDragAndDrop = (pins: IPin[]) => {
  const dispatch = useAppDispatch()
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)

  const [searchParams] = useSearchParams()
  const groupName = searchParams.get('groupName') || ''
  const isSwapMode = searchParams.get('mode') === 'swap'

  const [activeId, setActiveId] = useState<string | null>(null)

  const [isOverlayActive, setIsOverlayActive] = useState(false)

  const groupedPins = pins.reduce((acc, current) => {
    if (!current?.groupName) {
      return [...acc, current]
    }
    const groupIndex = acc.findIndex((p) => p.id === current.groupName)
    if (groupIndex === -1) {
      return [...acc, { ...current, id: current.groupName, pins: [current] }]
    }
    const pinsGroup = acc[groupIndex]
    acc.splice(groupIndex, 1, { ...pinsGroup, pins: [...(pinsGroup.pins || []), current] })
    return acc
  }, [] as GroupedPin[])

  const getPinOverlay = useCallback(() => {
    const pin = pins.find((pin) => pin.id === activeId)

    if (!pin) {
      return null
    }

    const app: AppNostr = {
      picture: pin.icon,
      name: pin.title,
      naddr: pin.appNaddr,
      url: pin.url,
      order: pin.order
    }
    return app
  }, [pins, activeId])

  const getPinsByGroupName = useCallback(() => {
    if (!groupName.trim().length) return []

    return pins.filter((p) => p.groupName === groupName)
  }, [groupName, pins])

  // Event handlers
  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
  }

  const handleDragOver = ({ over }: DragOverEvent) => {
    const isGroup = checkIsGroupType(over)
    if (isGroup) return setIsOverlayActive(true)

    return setIsOverlayActive(false)
  }

  const onSortEnd = useCallback(
    (activeId: PinID, overId: PinID) => {
      if (currentWorkSpace) {
        dispatch(
          swapPins({
            fromID: activeId,
            toID: overId,
            workspacePubkey: currentWorkSpace.pubkey
          })
        )
      }
    },
    [dispatch, currentWorkSpace]
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)

    if (over && active.id !== over.id) {
      const isGroup = checkIsGroupType(over)
      const findActivePin = groupedPins.find((pin) => pin.id === active.id)
      const findOverPin = groupedPins.find((pin) => pin.id === over.id)

      if (!findActivePin || !findOverPin) return undefined

      if (isSwapMode) {
        return onSortEnd(active.id, isGroup && findOverPin.pins ? findOverPin.pins[0].id : over.id)
      }

      const newPins = pins.map((p) => {
        const groupName = getDefaultGroupName(groupedPins)

        if (p.id === findActivePin.id) return { ...p, groupName: isGroup ? over.id : groupName }
        if (p.id === findOverPin.id && !isGroup) return { ...p, groupName: groupName }

        return p
      })

      dispatch(bulkEditPinsWorkspace({ pins: newPins, workspacePubkey: currentWorkSpace?.pubkey }))
    }
  }

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    pinsGroup: getPinsByGroupName(),
    pinOverlay: getPinOverlay(),
    currentGroupName: groupName,
    groupedPins,
    isOverlayActive,
    isSwapMode
  }
}
