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
        const trendingProfiles: ITrendingProfiles = response.profiles.map((el) => ({
          ...JSON.parse(el.profile.content),
          npub: getNpub(el.pubkey),
          pubkey: el.pubkey
        }))

        return trendingProfiles
      }
    })
  })
})
