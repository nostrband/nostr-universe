import { useEffect } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TrustNet } from 'trustnet'
import { fetchMetas, fetchPubkeyEvents } from '@/modules/nostr'
import { MetaEvent } from '@/types/meta-event'
import { useAppSelector } from '@/store/hooks/redux'
import { useMemo, useState } from 'react'

type TrustAssignment = {
  src: string
  weight: number
  dst: string
}

const TOP_EVENTS_SCORE_SUM = 0.5

export const useTrustRankings = () => {
  const { currentPubkey } = useAppSelector((state) => state.keys)

  const [profiles, setProfiles] = useState<(MetaEvent & { score: number })[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  const getTopRankedEvents = async () => {
    try {
      setIsLoading(true)
      setIsEmpty(false)
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

      const topRankedProfilesAll = Object.entries(pubkeysWithRankingObject).sort((a, b) => b[1] - a[1])
      let sum = 0
      const topRankedProfiles = topRankedProfilesAll.filter((r) => {
        sum += r[1]
        return sum < TOP_EVENTS_SCORE_SUM
      })
      console.log('topRankedProfiles', topRankedProfiles.length)

      if (!topRankedProfiles.length) {
        setIsEmpty(true)
        return setIsLoading(false)
      }

      const minScore = topRankedProfiles[topRankedProfiles.length - 1][1]
      const maxScore = topRankedProfiles[0][1]
      const topPubkeys = topRankedProfiles.map(([pubkey]) => pubkey)
      const metas = await fetchMetas(topPubkeys, false)

      const metasWithScore = topRankedProfiles
        .map((r) => {
          const pubkey = r[0]
          const trustNetScore = r[1]
          const meta = metas.find((m) => m.pubkey === pubkey) || ({} as MetaEvent)
          const score = Math.ceil((75 * (trustNetScore - minScore * 0.99)) / maxScore)
          return {
            ...meta,
            score
          }
        })
        .filter((m) => !!m.pubkey)

      // const metasWithScore = metas.map((meta) => {
      //   const score = pubkeysWithRankingObject[meta.pubkey]
      //   return {
      //     ...meta,
      //     score
      //   }
      // }).sort((a, b) => b.score - a.score)

      setProfiles(metasWithScore)
      setIsLoading(false)
      setIsEmpty(false)
    } catch (error) {
      setIsLoading(false)
      setIsEmpty(false)
    }
  }

  useEffect(() => {
    return () => {
      setIsLoading(false)
      setIsEmpty(false)
    }
  }, [])

  const memoizedProfiles = useMemo(() => profiles, [profiles])

  return {
    getTopRankedEvents,
    isLoading,
    profiles: memoizedProfiles,
    setProfiles,
    isEmpty: isEmpty && profiles.length === 0
  }
}
