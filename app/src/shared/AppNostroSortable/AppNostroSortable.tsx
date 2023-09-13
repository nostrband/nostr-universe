import { FC } from 'react'
import { AppNostro } from '../AppNostro/AppNostro'
import { AppNostroSortableProps } from './types'
import { Container } from './styled'
import { useSortable } from '@dnd-kit/sortable'
import { CSS as cssDndKit } from '@dnd-kit/utilities'

export const AppNostroSortable: FC<AppNostroSortableProps> = ({ isDragging, id, ...restProps }) => {
  const { setNodeRef, transform, transition, listeners } = useSortable({ id })

  const style = {
    transform: cssDndKit.Transform.toString(transform),
    transition
  }

  return (
    <Container className={isDragging ? 'dragging-dbd-kit' : ''} ref={setNodeRef} style={style} {...listeners}>
      <AppNostro {...restProps} />
    </Container>
  )
}
