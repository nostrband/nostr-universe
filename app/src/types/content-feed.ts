export interface IContentFeedSetting {
  id: CONTENT_FEEDS
  hidden: boolean
}

export enum CONTENT_FEEDS {
  TRENDING_NOTES = 'trendingNotes',
  TRENDING_PROFILES = 'trendingProfiles',
  HIGHLIGHTS = 'highlights',
  BIG_ZAPS = 'bigZaps',
  LONG_POSTS = 'longPosts',
  LIVE_EVENTS = 'liveEvents',
  COMMUNITIES = 'communities',
  SUGGESTED_PROFILES = 'suggestedProfiles',
  APPS = 'apps'
}

export const DEFAULT_CONTENT_FEED_SETTINGS = [
  {
    id: CONTENT_FEEDS.APPS,
    hidden: false
  },
  {
    id: CONTENT_FEEDS.TRENDING_NOTES,
    hidden: false
  },
  {
    id: CONTENT_FEEDS.TRENDING_PROFILES,
    hidden: false
  },
  {
    id: CONTENT_FEEDS.HIGHLIGHTS,
    hidden: false
  },
  {
    id: CONTENT_FEEDS.BIG_ZAPS,
    hidden: false
  },
  {
    id: CONTENT_FEEDS.LONG_POSTS,
    hidden: false
  },
  {
    id: CONTENT_FEEDS.LIVE_EVENTS,
    hidden: false
  },
  {
    id: CONTENT_FEEDS.COMMUNITIES,
    hidden: false
  },
  {
    id: CONTENT_FEEDS.SUGGESTED_PROFILES,
    hidden: false
  }
]
