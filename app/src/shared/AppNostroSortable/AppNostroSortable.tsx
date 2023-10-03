import { FC, useState } from 'react'
import { AppNostro } from '../AppNostro/AppNostro'
import { AppNostroSortableProps } from './types'
import { Container } from './styled'
import { useSortable } from '@dnd-kit/sortable'
import { CSS as cssDndKit } from '@dnd-kit/utilities'
import { LongPressEventType, useLongPress } from 'use-long-press'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const AppNostroSortable: FC<AppNostroSortableProps> = ({ id, ...restProps }) => {
  const [isAppPressing, setIsAppPressing] = useState(false)
  const { handleOpen } = useOpenModalSearchParams()

  const { setNodeRef, transform, transition, listeners, isDragging, attributes } = useSortable({
    id,
    transition: {
      duration: 150, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })

  const style = {
    transform: cssDndKit.Transform.toString(transform),
    transition
  }

  const appLongPressHandler = () => {
    handleOpen(MODAL_PARAMS_KEYS.PIN_SETTINGS_MODAL)
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
      scale: isAppPressing ? '1.05' : '1'
    }
  }

  return (
    <Container
      className={isDragging ? 'dragging-dbd-kit' : ''}
      {...attributes}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...longPressHandlers}
    >
      <AppNostro {...restProps} containerProps={appContainerProps} />
    </Container>
  )
}
