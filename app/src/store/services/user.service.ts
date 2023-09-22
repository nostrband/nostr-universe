import { ReturnTypeSuggestedProfiles, SuggestedProfiles } from '@/types/suggested-profiles'
import { ReturnTrendingNotes, TrendingNotes } from '@/types/trending-notes'
import { ITrendingProfiles, ReturnTrendingProfiles } from '@/types/trending-profiles'
import { getNpub } from '@/utils/helpers/general'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

export const userService = createApi({
  reducerPath: 'userService',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.nostr.band/v0' }),
  endpoints: (build) => ({
    fetchTrendingProfiles: build.query({
      query: () => ({
        url: '/trending/profiles'
      }),
      transformResponse: (response: { profiles: ReturnTrendingProfiles }) => {
        const trendingProfiles: ITrendingProfiles = response.profiles
          .map((el) => {
            try {
              return {
                ...JSON.parse(el.profile.content),
                npub: getNpub(el.pubkey),
                pubkey: el.pubkey
              }
            } catch (e) {
              console.log('Failed to parse profile', e)
              return null
            }
          })
          .filter((p) => !!p)

        return trendingProfiles
      }
    }),
    fetchTrendingNotes: build.query({
      query: () => ({
        url: '/trending/notes'
      }),
      transformResponse: (response: { notes: ReturnTrendingNotes }) => {
        const trendingNotes: TrendingNotes = response.notes.map((el) => ({
          ...el.event,
          author: {
            ...el.author,
            npub: getNpub(el.pubkey),
            pubkey: el.pubkey,
            profile: JSON.parse(el.author.content)
          }
        }))

        return trendingNotes
      }
    }),
    fetchSuggestedProfiles: build.query({
      query: (pubkey: string) => ({
        url: `/suggested/profiles/${pubkey}`
      }),
      transformResponse: (response: { profiles: ReturnTypeSuggestedProfiles }) => {
        const suggestedProfiles: SuggestedProfiles = response.profiles
          .map((el) => {
            try {
              return {
                ...JSON.parse(el.profile.content),
                npub: getNpub(el.pubkey),
                pubkey: el.pubkey
              }
            } catch (e) {
              console.log('Failed to parse profile', e)
              return null
            }
          })
          .filter((p) => !!p)

        return suggestedProfiles
      }
    })
  })
})
