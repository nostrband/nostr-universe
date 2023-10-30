import { CSSProperties, FC, memo, useEffect, useState } from 'react'
import { StyledWrapper } from '../../styled'
import { Container } from '@/layout/Container/Conatiner'
import { EventTabs } from './EventTabs'
import { StyledTab, StyledTitle } from './styled'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { AuthoredEvent } from '@/types/authored-event'
import { LongNoteEvent } from '@/types/long-note-event'
import { MetaEvent } from '@/types/meta-event'
import { RecentProfile } from '../ItemRecentEvent/RecentProfile'
import { RecentNote } from '../ItemRecentEvent/RecentNote'
import { RecentLongNote } from '../ItemRecentEvent/RecentLongNote'
import { EVENTS } from './types'
import { TAB_LABELS, getRecentQueryInfo, prepareRecentEvents } from './conts'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { RecentEvent, deleteRecentEventByIdThunk } from '@/store/reducers/searchModal.slice'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { Skeleton, Stack } from '@mui/material'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { nostrbandRelay } from '@/modules/nostr'
import { nip19 } from '@nostrband/nostr-tools'
import { useOpenModalSearchParams } from '@/hooks/modal'

export const RecentEvents = memo(function RecentEventsDisplayName() {
  const { recentEvents, isRecentEventsLoading } = useAppSelector((state) => state.searchModal)
  const dispatch = useAppDispatch()
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const [groupedRecentEventsMap, setGroupedRecentEventsMap] = useState<{
    [key: string]: RecentEvent[]
  }>({})

  const [tabItems, setTabItems] = useState<{ label: string; key: EVENTS }[]>([])
  const [tabValue, setTabValue] = useState<EVENTS | string>('')

  const handleTabChange = (_: unknown, value: string) => {
    setTabValue(value)
  }

  useEffect(() => {
    if (recentEvents.length) {
      const groupedRecentEventsMap = prepareRecentEvents(recentEvents)

      const tabItems = Object.keys(groupedRecentEventsMap)
        .sort()
        .reverse()
        .map((groupKey) => TAB_LABELS[groupKey])

      setGroupedRecentEventsMap(groupedRecentEventsMap)
      setTabItems(tabItems)

      if (!tabValue) {
        setTabValue(tabItems[0].key)
      }
    }
    // eslint-disable-next-line
  }, [recentEvents])

  const handleDeleteRecentEvent = (id: string) => {
    dispatch(deleteRecentEventByIdThunk(id))
  }

  const handleOpenProfile = (profile: MetaEvent) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: profile.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpenContextMenu({ bech32: nprofile })
  }

  const handleOpenNote = (note: AuthoredEvent) => {
    const nevent = nip19.neventEncode({
      relays: [nostrbandRelay],
      id: note.id
    })

    handleOpenContextMenu({ bech32: nevent })
  }

  const handleOpenLongNote = (longNote: LongNoteEvent) => {
    const naddr = nip19.naddrEncode({
      pubkey: longNote.pubkey,
      kind: longNote.kind,
      identifier: longNote.identifier,
      relays: [nostrbandRelay]
    })

    handleOpenContextMenu({ bech32: naddr })
  }

  const renderContent = () => {
    const currentTabEvents = groupedRecentEventsMap[tabValue]

    if (tabValue === EVENTS.PROFILES && currentTabEvents?.length) {
      const RowProfile: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
        const profile = currentTabEvents[index].event as MetaEvent
        const queryInfo = currentTabEvents[index]
        const queryInfoText = getRecentQueryInfo(queryInfo.timestamp, queryInfo.query)
        return (
          <HorizontalSwipeVirtualItem style={style} index={index} itemCount={currentTabEvents.length}>
            <RecentProfile
              onClick={() => handleOpenProfile(profile)}
              profile={profile}
              queryTimeInfo={queryInfoText}
              onDeleteRecentEvent={() => handleDeleteRecentEvent(queryInfo.id)}
            />
          </HorizontalSwipeVirtualItem>
        )
      }
      return (
        <HorizontalSwipeVirtualContent
          itemHight={192}
          itemSize={140}
          itemCount={currentTabEvents.length}
          RowComponent={RowProfile}
        />
      )
    }

    if (tabValue === EVENTS.NOTES && currentTabEvents?.length) {
      const RowTrendingNote: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
        const note = currentTabEvents[index].event as AuthoredEvent
        const queryInfo = currentTabEvents[index]
        const queryInfoText = getRecentQueryInfo(queryInfo.timestamp, queryInfo.query)
        return (
          <HorizontalSwipeVirtualItem style={style} index={index} itemCount={currentTabEvents.length}>
            <RecentNote
              onClick={() => handleOpenNote(note)}
              time={note.created_at}
              content={note.content}
              pubkey={note.pubkey}
              author={note.author}
              queryTimeInfo={queryInfoText}
              onDeleteRecentEvent={() => handleDeleteRecentEvent(queryInfo.id)}
            />
          </HorizontalSwipeVirtualItem>
        )
      }

      return (
        <HorizontalSwipeVirtualContent
          itemHight={165}
          itemSize={225}
          itemCount={currentTabEvents.length}
          RowComponent={RowTrendingNote}
        />
      )
    }

    if (tabValue === EVENTS.NOTES && currentTabEvents?.length) {
      const RowLongNote: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
        const longNote = currentTabEvents[index].event as LongNoteEvent
        const queryInfo = currentTabEvents[index]
        const queryInfoText = getRecentQueryInfo(queryInfo.timestamp, queryInfo.query)
        return (
          <HorizontalSwipeVirtualItem style={style} index={index} itemCount={currentTabEvents.length}>
            <RecentLongNote
              onClick={() => handleOpenLongNote(longNote)}
              time={longNote.created_at}
              content={longNote.content}
              subtitle={longNote.title}
              pubkey={longNote.pubkey}
              author={longNote.author}
              queryTimeInfo={queryInfoText}
              onDeleteRecentEvent={() => handleDeleteRecentEvent(queryInfo.id)}
            />
          </HorizontalSwipeVirtualItem>
        )
      }

      return (
        <HorizontalSwipeVirtualContent
          itemHight={113}
          itemSize={225}
          itemCount={currentTabEvents.length}
          RowComponent={RowLongNote}
        />
      )
    }

    return null
  }

  const renderLoader = () => {
    if (!recentEvents.length && !isRecentEventsLoading) {
      return null
    }
    if (!recentEvents.length || isRecentEventsLoading) {
      return (
        <>
          <Container>
            <Stack flexDirection={'row'} gap={'0.75rem'} marginBottom={'1rem'}>
              <StyledTab
                label={<Skeleton animation="wave" variant="text" sx={{ fontSize: '1rem', minWidth: '4rem' }} />}
                value={'1'}
              />
              <StyledTab
                label={<Skeleton animation="wave" variant="text" sx={{ fontSize: '1rem', minWidth: '4rem' }} />}
                value={'2'}
              />
              <StyledTab
                label={<Skeleton animation="wave" variant="text" sx={{ fontSize: '1rem', minWidth: '4rem' }} />}
                value={'3'}
              />
            </Stack>
          </Container>
          <HorizontalSwipeContent childrenWidth={140}>
            <SkeletonProfiles />
          </HorizontalSwipeContent>
        </>
      )
    }
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle component="div">Recently found</StyledTitle>
      </Container>
      {!!recentEvents.length && !isRecentEventsLoading && (
        <>
          <EventTabs tabItems={tabItems} onChange={handleTabChange} value={tabValue} />
          {renderContent()}
        </>
      )}
      {renderLoader()}
    </StyledWrapper>
  )
})
