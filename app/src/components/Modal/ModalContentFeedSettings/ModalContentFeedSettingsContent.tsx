import { FC } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import { selectWorkspaceContentFeeds } from '@/store/reducers/workspaces.slice'
import { useAppSelector } from '@/store/hooks/redux'
import { List } from '@mui/material'
import { CONTENT_FEED_LABELS } from './const'
import { ContentFeedItem } from './components/ContentFeedItem'
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'

type ModalContentFeedSettingsContentProps = {
  handleClose: () => void
}

export const ModalContentFeedSettingsContent: FC<ModalContentFeedSettingsContentProps> = () => {
  const contentFeeds = useAppSelector(selectWorkspaceContentFeeds)

  const contentFeedsIds = contentFeeds.map((feed) => feed.id)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5
    }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return null
    const oldIndex = contentFeeds.findIndex((feed) => feed.id === active.id)
    const newIndex = contentFeeds.findIndex((feed) => feed.id === over.id)
    const newItemsArray = arrayMove(contentFeeds, oldIndex, newIndex)

    console.log(newItemsArray, 'HISH')
    return newItemsArray
  }

  return (
    <Container>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={contentFeedsIds}>
          <List>
            {contentFeeds.map((feed) => {
              return (
                <ContentFeedItem
                  title={CONTENT_FEED_LABELS[feed.id]}
                  key={feed.id}
                  checked={!feed.hidden}
                  id={feed.id}
                />
              )
            })}
          </List>
        </SortableContext>
      </DndContext>
    </Container>
  )
}
