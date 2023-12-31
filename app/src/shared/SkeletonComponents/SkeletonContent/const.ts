import { APP_NOSTR_SIZE } from '@/consts'

const CONTENT_HEIGHT_VALUE = {
  [APP_NOSTR_SIZE.BIG]: 60,
  [APP_NOSTR_SIZE.LARGE]: 50,
  [APP_NOSTR_SIZE.MEDIUM]: 40,
  [APP_NOSTR_SIZE.SMALL]: 30,
  [APP_NOSTR_SIZE.EXTRA_SMALL]: 20
}

export const SKELETON_CONTENT_HEIGHT_VALUE = {
  [APP_NOSTR_SIZE.BIG]: CONTENT_HEIGHT_VALUE[APP_NOSTR_SIZE.BIG],
  [APP_NOSTR_SIZE.LARGE]: CONTENT_HEIGHT_VALUE[APP_NOSTR_SIZE.LARGE],
  [APP_NOSTR_SIZE.MEDIUM]: CONTENT_HEIGHT_VALUE[APP_NOSTR_SIZE.MEDIUM],
  [APP_NOSTR_SIZE.SMALL]: CONTENT_HEIGHT_VALUE[APP_NOSTR_SIZE.SMALL],
  [APP_NOSTR_SIZE.EXTRA_SMALL]: CONTENT_HEIGHT_VALUE[APP_NOSTR_SIZE.EXTRA_SMALL]
}
