export const cacheRelayHostname = 'localcache.spring.site'
export const cacheRelay = `wss://${cacheRelayHostname}/`

export const nostrbandRelay = 'wss://relay.nostr.band/'
export const nostrbandRelayAll = 'wss://relay.nostr.band/all'

// cacheRelay
export const readRelays = [cacheRelay]//nostrbandRelay, 'wss://relay.damus.io', 'wss://nos.lol']//, 'wss://relay.nostr.bg', 'wss://nostr.mom']
export const writeRelays = [...readRelays, 'wss://nostr.mutinywallet.com'] // for broadcasting
export const allRelays = [nostrbandRelayAll, ...writeRelays]

export const nsbRelays = ['wss://relay.nsecbunker.com']
