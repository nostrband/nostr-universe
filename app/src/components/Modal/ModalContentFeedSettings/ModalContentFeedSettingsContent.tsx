import { FC } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import {
  selectWorkspaceContentFeeds,
  switchFeedVisibilityWorkspace,
  updateWorkspaceContentFeedSettings
} from '@/store/reducers/workspaces.slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { List } from '@mui/material'
import { CONTENT_FEED_LABELS } from './const'
import { ContentFeedItem } from './components/ContentFeedItem'
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { dbi } from '@/modules/db'
import { StyledHint } from './styled'
import { IContentFeedSetting } from '@/types/content-feed'

type ModalContentFeedSettingsContentProps = {
  handleClose: () => void
}

export const ModalContentFeedSettingsContent: FC<ModalContentFeedSettingsContentProps> = () => {
  const contentFeeds = useAppSelector(selectWorkspaceContentFeeds)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const dispatch = useAppDispatch()

  const contentFeedsIds = contentFeeds.map((feed: IContentFeedSetting) => feed.id)

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return null
    const oldIndex = contentFeeds.findIndex((feed) => feed.id === active.id)
    const newIndex = contentFeeds.findIndex((feed) => feed.id === over.id)
    const newContentFeeds = arrayMove(contentFeeds, oldIndex, newIndex)
    dbi.updateContentFeedSettings(currentPubkey, newContentFeeds)
    dispatch(updateWorkspaceContentFeedSettings({ workspacePubkey: currentPubkey, newSettings: newContentFeeds }))
  }

  const handleFeedVisibilityChange = async (feedId: string) => {
    try {
      const newContentFeedSettings = contentFeeds.map((f) => {
        if (f.id === feedId) {
          return { ...f, hidden: !f.hidden }
        }
        return f
      })
      dbi.updateContentFeedSettings(currentPubkey, newContentFeedSettings)
      dispatch(switchFeedVisibilityWorkspace({ workspacePubkey: currentPubkey, newContentFeedSettings }))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <StyledHint>Drag the feeds to change their order.</StyledHint>

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
                  onSwitchFeedVisibility={() => handleFeedVisibilityChange(feed.id)}
                />
              )
            })}
          </List>
        </SortableContext>
      </DndContext>
    </Container>
  )
}
