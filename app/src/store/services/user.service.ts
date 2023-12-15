import { parseProfileJson, putEventsToCache } from '@/modules/nostr'
import { createAugmentedEvent, createEvent } from '@/types/augmented-event'
import { AuthoredEvent, createAuthoredEvent } from '@/types/authored-event'
import { MetaEvent, createMetaEvent } from '@/types/meta-event'
import { ReturnTypeSuggestedProfiles } from '@/types/suggested-profiles'
import { ReturnTypeTrendingNotes } from '@/types/trending-notes'
import { ReturnTypeTrendingProfiles } from '@/types/trending-profiles'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

export const userService = createApi({
  reducerPath: 'userService',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.nostr.band/v0' }),
  tagTypes: ['TrendingProfiles', 'TrendingNotes'],
  endpoints: (build) => ({
    fetchTrendingProfiles: build.query({
      query: () => ({
        url: '/trending/profiles'
      }),
      transformResponse: (response: { profiles: ReturnTypeTrendingProfiles }) => {
        const trendingProfiles: MetaEvent[] = response.profiles
          .map((el) => {
            if (!el.profile) return {} as MetaEvent
            const meta = createMetaEvent(createAugmentedEvent(createEvent(el.profile)))
            meta.profile = parseProfileJson(meta)
            return meta
          })
          .filter((m) => !!m.pubkey)

        putEventsToCache(trendingProfiles)

        return trendingProfiles
      },
      providesTags: ['TrendingProfiles']
    }),
    fetchTrendingNotes: build.query({
      query: () => ({
        url: '/trending/notes'
      }),
      transformResponse: (response: { notes: ReturnTypeTrendingNotes }) => {
        const trendingNotes: AuthoredEvent[] = response.notes
          .map((el) => {
            if (!el.event) return {} as AuthoredEvent
            const note = createAuthoredEvent(createAugmentedEvent(createEvent(el.event)))
            note.author = createMetaEvent(createAugmentedEvent(createEvent(el.author)))
            note.author.profile = parseProfileJson(note.author)
            return note
          })
          .filter((a) => !!a.pubkey)

        putEventsToCache(trendingNotes)
        // @ts-ignore
        putEventsToCache(trendingNotes.map(n => n.author).filter(m => !!m))

        return trendingNotes
      },
      providesTags: ['TrendingNotes']
    }),
    fetchSuggestedProfiles: build.query({
      query: (pubkey: string) => ({
        url: `/suggested/profiles/${pubkey}`
      }),
      transformResponse: (response: { profiles: ReturnTypeSuggestedProfiles }) => {
        const suggestedProfiles: MetaEvent[] = response.profiles
          .map((el) => {
            if (!el.profile) return {} as MetaEvent
            const meta = createMetaEvent(createAugmentedEvent(createEvent(el.profile)))
            meta.profile = parseProfileJson(meta)
            return meta
          })
          .filter((m) => !!m.pubkey)

        putEventsToCache(suggestedProfiles)

        return suggestedProfiles
      }
    })
  })
})
