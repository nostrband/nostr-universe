export interface IContentFeedSetting {
  id: CONTENT_FEEDS
  order: number
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
