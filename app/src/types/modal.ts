export enum MODAL_PARAMS_KEYS {
  KEYS_PROFILE = 'keys-profile',
  KEY_IMPORT = 'key-import',
  SELECT_APP = 'select-app',
  SEARCH_MODAL = 'search-modal',
  CONTEXT_MENU = 'context-menu',
  TAB_MODAL = 'tab-modal',
  TAB_MENU = 'tab-menu',
  PERMISSIONS_REQ = 'permissions-req',
  PERMISSIONS_MODAL = 'permissions-modal',
  TABS_SWITCHER = 'tabs-switcher',
  PROFILE_PAGE = 'profile-page',
  SEARCH_PAGE = 'search-page',
  TABS_SWITCHER_PAGE = 'tabs-switcher-page',
  APPS_PAGE = 'apps-page',
  WALLET_MODAL = 'wallet-modal',
  PROFILE_TAB_MENU_MODAL = 'profile-tab-menu-modal',
  ADD_KEY_MODAL = 'add-key-modal',
  ABOUT_MODAL = 'about-modal',
  FIND_APP = 'find-app',
  ADD_NSB_KEY_MODAL = 'add-nsb-key-modal',
  PIN_SETTINGS_MODAL = 'pin-settings-modal',
  CONTENT_FEEDS_SETTINGS_MODAL = 'content-feeds-settings-modal',
  KIND = 'kind',
  SIGNED_EVENTS_MODAL = 'signed-events-modal',
  NPS_SCORE_MODAL = 'nps-score-modal',
  PAYMENT_HISTORY_MODAL = 'payment-history-modal',
  APP_OF_THE_DAY_MODAL = 'app-of-the-day-modal',
  SYNC_MODAL = 'sync-modal',
  FEED_MODAL = 'feed-modal'
}

export const EXTRA_OPTIONS = {
  [MODAL_PARAMS_KEYS.SELECT_APP]: 'addr',
  [MODAL_PARAMS_KEYS.KIND]: 'kind'
}
