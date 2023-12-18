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
import { useAppSelector } from '@/store/hooks/redux'
import { isGuest } from '@/utils/helpers/prepare-data'
import { CONTENT_FEEDS } from '@/types/content-feed'
import { useCallback, Fragment, memo } from 'react'
import { selectCurrentWorkspaceFeedSettings, selectKeys } from '@/store/store'
import { NPSWidget } from '@/components/NPSWidget/NPSWidget'
import { RecommendAppWidget } from '@/components/RecommendAppWidget/RecommendAppWidget'
import { AppOfDayWidget } from '@/components/AppOfDayWidget/AppOfDayWidget'
import { getSlug } from '@/utils/helpers/general'

export const MainPage = memo(function MainPage() {
  // const isShow = searchParams.get('page') === 'content'
  const isShow = useAppSelector((state) => getSlug(state.router.slugs, 'content'))

  const { keys } = useAppSelector(selectKeys)
  const { isShowWidget } = useAppSelector((state) => state.feedbackInfo)
  const { isShowAOTDWidget } = useAppSelector((state) => state.notifications)

  const guest = !keys.length || isGuest(keys[0])

  const contentFeedSettings = useAppSelector(selectCurrentWorkspaceFeedSettings)

  const renderFeeds = useCallback(() => {
    if (contentFeedSettings.length === 0) {
      return (
        <>
          <AppsNostro />
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
        </>
      )
    }

    const feeds: Record<string, JSX.Element> = {
      [CONTENT_FEEDS.TRENDING_NOTES]: <TrendingNotes />,
      [CONTENT_FEEDS.TRENDING_PROFILES]: <TrendingProfiles />,
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

    return contentFeedSettings.map((feed, i) => {
      if (feed.hidden) return null
      return <Fragment key={i}>{feeds[feed.id]}</Fragment>
    })
  }, [contentFeedSettings, guest])

  return (
    <StyledWrapVisibility isShow={isShow}>
      <RecommendAppWidget />
      {guest && <WelcomeWidget />}
      {isShowWidget && <NPSWidget />}
      {isShowAOTDWidget && <AppOfDayWidget />}
      {renderFeeds()}
    </StyledWrapVisibility>
  )
})
