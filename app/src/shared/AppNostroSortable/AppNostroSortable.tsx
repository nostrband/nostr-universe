import { FC, useState } from 'react'
import { AppNostro } from '../AppNostro/AppNostro'
import { AppNostroSortableProps } from './types'
import { Container } from './styled'
import { LongPressEventType, useLongPress } from 'use-long-press'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { StyledDroppableContainer } from '@/pages/AppsPage/components/styled'
import { Zoom } from '@mui/material'

const ITEM_DATA = {
  type: 'item'
}

export const AppNostroSortable: FC<AppNostroSortableProps> = ({ id, ...restProps }) => {
  const [isAppPressing, setIsAppPressing] = useState(false)
  const { handleOpen } = useOpenModalSearchParams()

  const {
    setNodeRef: setDroppableNodeRef,
    isOver,
    ...rest
  } = useDroppable({
    id: id,
    data: ITEM_DATA
  })

  const { setNodeRef, listeners, isDragging, attributes } = useDraggable({
    id,
    data: ITEM_DATA
  })

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transition: 'opacity 0.1s'
  }

  const appLongPressHandler = () => {
    handleOpen(MODAL_PARAMS_KEYS.PIN_SETTINGS_MODAL, { search: { pinId: id.toString() } })
  }

  const bind = useLongPress(appLongPressHandler, {
    onStart: () => {
      setIsAppPressing(true)
    },
    onFinish: () => {
      setIsAppPressing(false)
    },
    onCancel: () => {
      setIsAppPressing(false)
    },
    //onMove: () => console.log("Detected mouse or touch movement"),
    filterEvents: () => true, // All events can potentially trigger long press
    threshold: 1000,
    captureEvent: true,
    cancelOnMovement: true,
    cancelOutsideElement: true,
    detect: LongPressEventType.Pointer
  })
  const longPressHandlers = bind('app context')

  const appContainerProps = {
    sx: {
      scale: isAppPressing || (isOver && rest.active?.id !== rest.over?.id) ? '1.05' : '1'
    }
  }

  return (
    <Zoom in>
      <StyledDroppableContainer ref={setDroppableNodeRef}>
        <Container {...attributes} ref={setNodeRef} style={style} {...listeners} {...longPressHandlers}>
          <AppNostro {...restProps} containerProps={appContainerProps} />
        </Container>
      </StyledDroppableContainer>
    </Zoom>
  )
}
