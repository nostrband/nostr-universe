import { FC, forwardRef, useCallback, useState } from 'react'
import { Backdrop, BackdropProps, DialogProps, Grow, GrowProps, Paper, PaperProps } from '@mui/material'
import { IPin } from '@/types/workspace'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { swapPins, updatePinWorkspace } from '@/store/reducers/workspaces.slice'
import { dbi } from '@/modules/db'
import { DndContext, DragEndEvent, DragStartEvent, pointerWithin, useDroppable } from '@dnd-kit/core'
import { useSensors } from '../../utils/useSensors'
import { StyledDialog } from './styled'
import { PinGroupModalContent } from './PinGroupModalContent'

type PinGroupModalProps = DialogProps & {
  groupName: string
  pinsGroup?: IPin[]
  handleClose: () => void
  pins: IPin[]
  groupDefaultName: string
}

type PinID = string | number

export const PinGroupModal: FC<PinGroupModalProps> = ({ open, handleClose, ...rest }) => {
  const sensors = useSensors()
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const dispatch = useAppDispatch()

  const { pins = [], pinsGroup = [] } = rest

  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
  }

  const handleRemovePinFromGroup = (pin: IPin) => {
    const updatedPin = { ...pin, groupName: '' }
    dispatch(
      updatePinWorkspace({
        pin: updatedPin,
        workspacePubkey: currentPubkey
      })
    )
    dbi.updatePin(updatedPin)
    if (pinsGroup.length === 1) {
      handleClose()
    }
  }

  const onSortEnd = useCallback(
    (activeId: PinID, overId: PinID) => {
      if (currentPubkey) {
        dispatch(
          swapPins({
            fromID: activeId,
            toID: overId,
            workspacePubkey: currentPubkey
          })
        )
      }
    },
    [dispatch, currentPubkey]
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)

    if (over && active.id !== over.id) {
      if (over.id === 'paper') {
        return setActiveId(null)
      }
      if (over.id === 'trash') {
        const pin = pins.find((pin) => pin.id === active.id)

        if (pin) {
          return handleRemovePinFromGroup(pin)
        }
        return null
      }

      const findActivePin = pins.find((pin) => pin.id === active.id)
      const findOverPin = pins.find((pin) => pin.id === over.id)

      if (!findActivePin || !findOverPin) return undefined
      onSortEnd(findActivePin.id, findOverPin.id)
    }
  }
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveId(null)}
      collisionDetection={pointerWithin}
    >
      <StyledDialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => handleClose()}
        components={{
          Backdrop: TrashableContainer
        }}
        PaperComponent={DroppablePaper}
      >
        {open && (
          <PinGroupModalContent
            {...rest}
            handleClose={handleClose}
            activeId={activeId}
            handleRemovePinFromGroup={handleRemovePinFromGroup}
          />
        )}
      </StyledDialog>
    </DndContext>
  )
}

const DroppablePaper = (props: PaperProps) => {
  const { setNodeRef } = useDroppable({
    id: 'paper'
  })
  return <Paper {...props} ref={setNodeRef} />
}

const TrashableContainer = (props: BackdropProps) => {
  const { setNodeRef } = useDroppable({
    id: 'trash'
  })
  return <Backdrop {...props} ref={setNodeRef} />
}

const Transition = forwardRef(function Transition(props: GrowProps, ref) {
  return <Grow ref={ref} {...props} />
})
