// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TrustNet } from 'trustnet'
import { fetchMetas, fetchPubkeyEvents } from '@/modules/nostr'
import { MetaEvent } from '@/types/meta-event'
import { useAppSelector } from '@/store/hooks/redux'
import { useState } from 'react'

type TrustAssignment = {
  src: string
  weight: number
  dst: string
}

const TOP_EVENTS_COUNT = 100

export const useTrustRankings = () => {
  const { currentPubkey } = useAppSelector((state) => state.keys)

  const [profiles, setProfiles] = useState<(MetaEvent & { score: number })[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getTopRankedEvents = async () => {
    try {
      setIsLoading(true)
      const pubkeysMentionsMap = new Map()

      const events = await fetchPubkeyEvents({
        cacheOnly: true,
        limit: 2000,
        pubkeys: [currentPubkey]
      })
      events.forEach((e) =>
        e.tags
          .filter((tag) => tag[0] === 'p')
          .forEach((t) => {
            if (t[1] === currentPubkey) return undefined

            if (pubkeysMentionsMap.has(t[1])) {
              return pubkeysMentionsMap.set(t[1], pubkeysMentionsMap.get(t[1]) + 1)
            }
            return pubkeysMentionsMap.set(t[1], 1)
          })
      )
      const totalMentions = [...pubkeysMentionsMap.values()].reduce((acc, c) => acc + c, 0)

      const trustAssignments: TrustAssignment[] = []

      pubkeysMentionsMap.forEach((count, pubkey) => {
        return trustAssignments.push({
          src: currentPubkey,
          dst: pubkey,
          weight: count / totalMentions
        })
      })

      const trust = new TrustNet()
      await trust.load(currentPubkey, trustAssignments)

      const pubkeysWithRankingObject: { [pubkey: string]: number } = trust.getRankings() || {}

      const topRankedProfiles = Object.entries(pubkeysWithRankingObject)
        .sort((a, b) => b[1] - a[1])
        .slice(0, TOP_EVENTS_COUNT)

      const topPubkeys = topRankedProfiles.map(([pubkey]) => pubkey)

      const metas = await fetchMetas(topPubkeys, false)

      const metasWithScore = metas.map((meta) => {
        const score = pubkeysWithRankingObject[meta.pubkey]
        return {
          ...meta,
          score
        }
      })

      setProfiles(metasWithScore)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return {
    getTopRankedEvents,
    isLoading,
    profiles
  }
}