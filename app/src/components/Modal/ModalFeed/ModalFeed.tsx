import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalFeedContent } from './ModalFeedContent'
import { useSearchParams } from 'react-router-dom'
import { IContentWorkSpace } from '@/store/reducers/contentWorkspace'
import { useAppSelector } from '@/store/hooks/redux'

export const ModalFeed = () => {
  const { handleClose, getModalOpened, getModalOrder } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.FEED_MODAL)
  const order = getModalOrder(MODAL_PARAMS_KEYS.FEED_MODAL)
  const data = useAppSelector((state) => ({ ...state.contentWorkSpace, ...state.bookmarks }))

  const [searchParams] = useSearchParams()

  const keyData = (searchParams.get('keyData') || '') as keyof IContentWorkSpace

  const TITLES_FEED: Record<string, string> = {
    highlights: 'Highlights',
    bigZaps: 'Big Zaps',
    longPosts: 'Long posts',
    liveEvents: 'Live Streams',
    communities: 'Active communities',
    suggestedProfiles: 'Suggested profiles',
    trendingNotes: 'Trending Notes',
    trendingProfiles: 'Trending Profiles',
    contactList: 'Following',
    bestNotes: 'Favorite Notes',
    bestLongNotes: 'Favorite Long Posts',
    bookmarkLists: 'Bookmark Lists',
    profileLists: 'Profile Lists'
  }

  const label = TITLES_FEED[keyData]

  const getDataContent = (key: string) => {
    switch (key) {
      case 'highlights':
        if (!data.highlights) {
          return []
        }

        return data.highlights

      case 'longPosts':
        if (!data.longPosts) {
          return []
        }

        return data.longPosts
      case 'liveEvents':
        if (!data.liveEvents) {
          return []
        }

        return data.liveEvents

      case 'communities':
        if (!data.communities) {
          return []
        }

        return data.communities.map((el) => ({ ...el, post: el }))

      case 'suggestedProfiles':
        if (!data.suggestedProfiles) {
          return []
        }

        return data.suggestedProfiles

      case 'trendingNotes':
        if (!data.trendingNotes) {
          return []
        }

        return data.trendingNotes

      case 'trendingProfiles':
        if (!data.trendingProfiles) {
          return []
        }

        return data.trendingProfiles

      case 'bigZaps':
        if (!data.bigZaps) {
          return []
        }

        return data.bigZaps.map((el) => {
          const event = el.targetEvent || el.targetMeta || el

          return event
        })

      case 'contactList':
        if (!data.contactList) {
          return []
        }

        return data.contactList.contactEvents

      case 'bestNotes':
        if (!data.bestNotes) {
          return []
        }

        return data.bestNotes.map((el) => {
          const event = el.targetEvent || el

          return event
        })

      case 'bestLongNotes':
        if (!data.bestLongNotes) {
          return []
        }

        return data.bestLongNotes.map((el) => {
          const event = el.targetEvent || el

          return event
        })

      case 'bookmarkLists':
        if (!data.bookmarkLists) {
          return []
        }

        return data.bookmarkLists

      case 'profileLists':
        if (!data.profileLists) {
          return []
        }

        return data.profileLists

      default:
        return []
    }
  }

  const dataContent = getDataContent(keyData)

  return (
    <Modal title={label} open={isOpen} zIndex={order} handleClose={() => handleClose()}>
      {isOpen && dataContent && <ModalFeedContent dataContent={dataContent} />}
    </Modal>
  )
}
