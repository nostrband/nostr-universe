import { TrendingProfiles } from './components/TrendingProfiles/TrendingProfiles'
import { AppsNostro } from './components/AppsNostro/AppsNostro'
import { Highlights } from './components/Highlights/Highlights'
import { TrendingNotes } from './components/TrendingNotes/TrendingNotes'
import { BigZaps } from './components/BigZaps/BigZaps'
import { LongPosts } from './components/LongPosts/LongPosts'
import { LiveEvents } from './components/LiveEvents/LiveEvents'
import { Communities } from './components/Communities/Communities'
import { SuggestedProfiles } from './components/SuggestedProfiles/SuggestedProfiles'
import { WelcomeWidget } from '@/components/WelcomeWidget/WelcomeWidget'
import { StyledWrapVisibility } from '../styled'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks/redux'
import { isGuest } from '@/utils/helpers/prepare-data'
import { CONTENT_FEEDS } from '@/types/content-feed'

export const MainPage = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'content'

  const { keys, currentPubkey } = useAppSelector((state) => state.keys)
  const guest = !keys.length || isGuest(keys[0])

  const currentWorkspace = useAppSelector((state) =>
    state.workspaces.workspaces.find((ws) => ws.pubkey === currentPubkey)
  )

  const contentFeedSettings = currentWorkspace?.contentFeedSettings || []

  const renderFeeds = () => {
    if (contentFeedSettings.length === 0) {
      return (
        <>
          <TrendingNotes />
          <TrendingProfiles />
          {!guest && (
            <>
              <Highlights />
              <BigZaps />
              <LongPosts />
              <LiveEvents />
              <Communities />
              <SuggestedProfiles />
            </>
          )}
          <AppsNostro />
        </>
      )
    }

    const feeds: Record<string, JSX.Element> = {
      [CONTENT_FEEDS.TRENDING_NOTES]: <TrendingNotes />,
      [CONTENT_FEEDS.TRENDING_PROFILES]: <TrendingNotes />,
      [CONTENT_FEEDS.APPS]: <AppsNostro />
    }
    if (!guest) {
      feeds[CONTENT_FEEDS.HIGHLIGHTS] = <Highlights />
      feeds[CONTENT_FEEDS.BIG_ZAPS] = <BigZaps />
      feeds[CONTENT_FEEDS.LONG_POSTS] = <LongPosts />
      feeds[CONTENT_FEEDS.LIVE_EVENTS] = <LiveEvents />
      feeds[CONTENT_FEEDS.COMMUNITIES] = <Communities />
      feeds[CONTENT_FEEDS.SUGGESTED_PROFILES] = <SuggestedProfiles />
    }

    return contentFeedSettings.map((feed) => {
      if (feed.hidden) return null
      return feeds[feed.id]
    })
  }

  return (
    <StyledWrapVisibility isShow={isShow}>
      {guest && <WelcomeWidget />}
      {renderFeeds()}
    </StyledWrapVisibility>
  )
}
