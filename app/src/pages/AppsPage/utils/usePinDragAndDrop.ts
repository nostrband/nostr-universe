import { useCallback, useState } from 'react'
import { checkIsGroupingMode, checkIsGroupType } from './helpers'
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { IPin } from '@/types/workspace'
import { AppNostr } from '@/types/app-nostr'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { bulkEditPinsWorkspace, swapPins } from '@/store/reducers/workspaces.slice'
import { selectCurrentWorkspace } from '@/store/store'

type PinID = string | number

export const usePinDragAndDrop = (pins: IPin[]) => {
  const dispatch = useAppDispatch()
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)

  const [searchParams] = useSearchParams()
  const groupName = searchParams.get('groupName') || ''

  const [activeId, setActiveId] = useState<string | null>(null)

  const [overlay, setOverlay] = useState<'item' | 'group' | null>(null)

  const groupedPins = pins
    .reduce((acc, current, index) => {
      if (!current.groupName) {
        return [...acc, current]
      }

      const groupIndex = acc.findIndex((p) => p.id === current.groupName)

      if (groupIndex === -1) {
        const isEmptyGroup = current.pins === null
        return [...acc, { ...current, id: current.groupName, pins: isEmptyGroup ? [] : [current] }]
      }

      const pinsGroup = acc[groupIndex]

      acc.splice(groupIndex, 1)
      acc.splice(index, 1, { ...pinsGroup, pins: [...pinsGroup.pins, current] })
      return acc
    }, [] as IPin[])
    .sort((a, b) => a.order - b.order)

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

    return pins.filter((p) => !!p.title && p.groupName === groupName)
  }, [groupName, pins])

  // Event handlers
  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
    if (!active) return setOverlay(null)

    const isGroup = checkIsGroupType(active)
    if (isGroup) return setOverlay('group')

    return setOverlay('item')
  }

  const handleDragOver = () => {
    // setOverlay(null)
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
    setOverlay(null)

    if (over && active.id !== over.id) {
      const isGroupingMode = checkIsGroupingMode(active, over)
      const activeIsGroup = checkIsGroupType(active)
      const overIsGroup = checkIsGroupType(over)

      const findActivePin = groupedPins.find((pin) => pin.id === active.id)
      const findOverPin = groupedPins.find((pin) => pin.id === over.id)

      if (!findActivePin || !findOverPin) return undefined

      if (!isGroupingMode) {
        return onSortEnd(
          activeIsGroup ? findActivePin.pins[0].id : active.id,
          overIsGroup ? findOverPin.pins[0].id : over.id
        )
      }

      const newPins = pins
        .map((p) => {
          if (p.id === findActivePin.id) return { ...p, groupName: over.id }
          if (p.id === findOverPin.id) return undefined
          return p
        })
        .filter((p) => !!p)

      dispatch(bulkEditPinsWorkspace({ pins: newPins, workspacePubkey: currentWorkSpace?.pubkey }))
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setOverlay(null)
  }

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragCancel,
    pinsGroup: getPinsByGroupName(),
    pinOverlay: getPinOverlay(),
    currentGroupName: groupName,
    groupedPins,
    overlay
  }
}
