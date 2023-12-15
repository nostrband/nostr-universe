import { MIN_ZAP_AMOUNT } from "@/consts"
import { bootstrapNotifications } from "@/modules/AppInitialisation/utils"
import { EventFeed, fetchFollowedCommunities, fetchReactionTargetLongNotes, fetchReactionTargetNotes, isConnected, subscribeApps, subscribeBookmarkLists, subscribeContactList, subscribeFollowedHighlights, subscribeFollowedLiveEvents, subscribeFollowedLongNotes, subscribeFollowedZaps, subscribeProfileLists, subscribeProfiles } from "@/modules/nostr"
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux"
import { setApps } from "@/store/reducers/apps.slice"
import { selectContactList, setBigZaps, setCommunities, setContactList, setHighlights, setLiveEvents, setLongPosts } from "@/store/reducers/contentWorkspace"
import { AppNostr } from "@/types/app-nostr"
import { AugmentedEvent } from "@/types/augmented-event"
import { BookmarkListEvent } from "@/types/bookmark-list-event"
import { HighlightEvent } from "@/types/highlight-event"
import { LiveEvent } from "@/types/live-events"
import { LongNoteEvent } from "@/types/long-note-event"
import { ProfileListEvent } from "@/types/profile-list-event"
import { ZapEvent } from "@/types/zap-event"
import { isGuest } from "@/utils/helpers/prepare-data"
import { useCallback, useMemo } from "react"
import { useSigner } from "./signer"
import { ContactListEvent } from "@/types/contact-list-event"
import { setBestLongNotes, setBestNotes, setBookmarkLists, setProfileLists } from "@/store/reducers/bookmarks.slice"
import { MetaEvent } from "@/types/meta-event"
import { setCurrentProfile, setProfiles } from "@/store/reducers/profile.slice"

let appsFeed: EventFeed<AppNostr> | null = null
let highlightsFeed: EventFeed<HighlightEvent> | null = null
let bigZapFeed: EventFeed<ZapEvent> | null = null
let longPostFeed: EventFeed<LongNoteEvent> | null = null
let liveEventFeed: EventFeed<LiveEvent> | null = null
let profileListFeed: EventFeed<ProfileListEvent> | null = null
let bookmarkListFeed: EventFeed<BookmarkListEvent> | null = null

export const useFeeds = () => {
  const dispatch = useAppDispatch()
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const contactList = useAppSelector(selectContactList)
  const { decrypt } = useSigner()

  const stop = useCallback(() => {
    if (highlightsFeed) highlightsFeed.stop()
    if (bigZapFeed) bigZapFeed.stop()
    if (longPostFeed) longPostFeed.stop()
    if (liveEventFeed) liveEventFeed.stop()
    if (profileListFeed) profileListFeed.stop()
    if (bookmarkListFeed) bookmarkListFeed.stop()

    dispatch(setContactList({ contactList: null }))
    dispatch(setHighlights({ highlights: null }))
    dispatch(setBigZaps({ bigZaps: null }))
    dispatch(setLongPosts({ longPosts: null }))
    dispatch(setCommunities({ communities: null }))
    dispatch(setLiveEvents({ liveEvents: null }))

    dispatch(setBestNotes({ bestNotes: null }))
    dispatch(setBestLongNotes({ bestLongNotes: null }))
    dispatch(setProfileLists({ profileLists: null }))
    dispatch(setBookmarkLists({ bookmarkLists: null }))

  }, [dispatch])

  const reload = useCallback(async (full?: boolean) => {

    if (!isConnected()) return

    if (!appsFeed) {
      appsFeed = subscribeApps()
      const cb = (apps: AppNostr[]) => { dispatch(setApps({ apps })); console.log('new apps', apps) }
      appsFeed.onUpdate = cb
      appsFeed.onEOSE = (events: AppNostr[]) => {
        cb(events)
        bootstrapNotifications(events, dispatch)
      }
      appsFeed.start()
    }

    if (isGuest(currentPubkey)) return

    if (contactList) {
      //setContacts(contactList)

      if (full) {
        function setOnEvents<T extends AugmentedEvent>(feed: EventFeed<T>, cb: (events: T[]) => void) {
          feed.onUpdate = cb
          feed.onEOSE = cb
          feed.start()
        }

        highlightsFeed = subscribeFollowedHighlights(contactList.contactPubkeys)
        setOnEvents(highlightsFeed, highlights => { dispatch(setHighlights({ highlights })); console.log('new highlights', highlights) })

        bigZapFeed = subscribeFollowedZaps(contactList.contactPubkeys, MIN_ZAP_AMOUNT)
        setOnEvents(bigZapFeed, bigZaps => { dispatch(setBigZaps({ bigZaps })); console.log('new setBigZaps', bigZaps) })

        longPostFeed = subscribeFollowedLongNotes(contactList.contactPubkeys)
        setOnEvents(longPostFeed, longPosts => { dispatch(setLongPosts({ longPosts })); console.log('new longPosts', longPosts) })

        liveEventFeed = subscribeFollowedLiveEvents(contactList.contactPubkeys)
        setOnEvents(liveEventFeed, liveEvents => { dispatch(setLiveEvents({ liveEvents })); console.log('new liveEvents', liveEvents) })

        profileListFeed = subscribeProfileLists(currentPubkey, decrypt)
        setOnEvents(profileListFeed, profileLists => { dispatch(setProfileLists({ profileLists })); console.log('new profileLists', profileLists) })

        bookmarkListFeed = subscribeBookmarkLists(currentPubkey, decrypt)
        setOnEvents(bookmarkListFeed, bookmarkLists => { dispatch(setBookmarkLists({ bookmarkLists })); console.log('new bookmarkLists', bookmarkLists) })

      }

      reloadCommunities()
    }

    reloadBestNotes()
    reloadBestLongNotes()

  }, [currentPubkey, contactList, dispatch, decrypt])

  const reloadContactList = useCallback((pubkey?: string) => {
    dispatch(setContactList({ contactList: null }))

    subscribeContactList(pubkey || currentPubkey, async (contactList: ContactListEvent) => {
      dispatch(setContactList({ contactList }))
    })
  }, [dispatch, currentPubkey])

  const reloadProfiles = useCallback((keys: string[], pubkey: string) => {
    subscribeProfiles(keys, async (profile: MetaEvent) => {
      if (profile) {
        if (profile.pubkey === pubkey) {
          dispatch(setCurrentProfile({ profile }))
        }

        if (keys.find((key) => profile.pubkey === key)) {
          dispatch(setProfiles({ profiles: [profile] }))
        }
      }
    })

  }, [dispatch])

  const reloadApps = useCallback(() => {
    dispatch(setApps({ apps: null }))
    appsFeed?.reload()
  }, [dispatch])

  const reloadHighlights = useCallback(() => {
    dispatch(setHighlights({ highlights: null }))
    highlightsFeed?.reload()
  }, [dispatch])

  const reloadBigZaps = useCallback(() => {
    dispatch(setBigZaps({ bigZaps: null }))
    bigZapFeed?.reload()
  }, [dispatch])

  const reloadLongPosts = useCallback(() => {
    dispatch(setLongPosts({ longPosts: null }))
    longPostFeed?.reload()
  }, [dispatch])

  const reloadLiveEvents = useCallback(() => {
    dispatch(setLiveEvents({ liveEvents: null }))
    liveEventFeed?.reload()
  }, [dispatch])

  const reloadProfileLists = useCallback(() => {
    dispatch(setProfileLists({ profileLists: null }))
    profileListFeed?.reload()
  }, [dispatch])

  const reloadBookmarkLists = useCallback(() => {
    dispatch(setBookmarkLists({ bookmarkLists: null }))
    bookmarkListFeed?.reload()
  }, [dispatch])

  const reloadCommunities = useCallback(() => {
    if (!contactList) {
      dispatch(setCommunities({ communities: [] }))
      return
    }

    dispatch(setCommunities({ communities: null }))
    fetchFollowedCommunities(contactList.contactPubkeys)
      .then((communities) => {
        console.log('new communities', communities)
        dispatch(setCommunities({ communities }))
      })
      .catch(() => {
        dispatch(setCommunities({ communities: [] }))
      })

  }, [dispatch, contactList])

  const reloadBestNotes = useCallback(() => {
    if (isGuest(currentPubkey)) {
      dispatch(setBestNotes({ bestNotes: [] }))
      return
    }

    dispatch(setBestNotes({ bestNotes: null }))

    fetchReactionTargetNotes(currentPubkey)
      .then((bestNotes) => {
        console.log('new bestNotes', bestNotes)
        dispatch(setBestNotes({ bestNotes }))
      })
      .catch(() => {
        dispatch(setBestNotes({ bestNotes: [] }))
      })

  }, [dispatch, currentPubkey])

  const reloadBestLongNotes = useCallback(() => {
    if (isGuest(currentPubkey)) {
      dispatch(setBestLongNotes({ bestLongNotes: [] }))
      return
    }

    dispatch(setBestLongNotes({ bestLongNotes: null }))

    fetchReactionTargetLongNotes(currentPubkey)
      .then((bestLongNotes) => {
        console.log('new bestLongNotes', bestLongNotes)
        dispatch(setBestLongNotes({ bestLongNotes }))
      })
      .catch(() => {
        dispatch(setBestLongNotes({ bestLongNotes: [] }))
      })

  }, [dispatch, currentPubkey])

  return useMemo(() => ({
    stop,
    reload,
    reloadContactList,
    reloadProfiles,
    reloadApps,
    reloadHighlights,
    reloadBigZaps,
    reloadLongPosts,
    reloadLiveEvents,
    reloadCommunities,
    reloadBestNotes,
    reloadBestLongNotes,
    reloadProfileLists,
    reloadBookmarkLists
  }), [
    stop,
    reload,
    reloadContactList,
    reloadProfiles,
    reloadApps,
    reloadHighlights,
    reloadBigZaps,
    reloadLongPosts,
    reloadLiveEvents,
    reloadCommunities,
    reloadBestNotes,
    reloadBestLongNotes,
    reloadProfileLists,
    reloadBookmarkLists
  ])
}