import { useEffect } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
//import { TrustNet } from 'trustnet'
import { fetchMetas, fetchMuteLists, fetchPubkeyEvents } from '@/modules/nostr'
import { MetaEvent } from '@/types/meta-event'
import { useAppSelector } from '@/store/hooks/redux'
import { useMemo, useState } from 'react'
import { Kinds } from '@/modules/const/kinds'
import { AugmentedEvent } from '@/types/augmented-event'

// type TrustAssignment = {
//   src: string
//   weight: number
//   dst: string
// }

function getWeight(e: AugmentedEvent) {
  switch (e.kind as number) {
    case Kinds.CONTACT_LIST:
      return 1000
    case Kinds.PROFILE_LIST:
      return 10
    case Kinds.BOOKMARKS:
      return 5
    case Kinds.NOTE:
      return 1
    default:
      return 3
  }
}

const TOP_EVENTS_SCORE_SUM = 0.6

export const useTrustRankings = () => {
  const { currentPubkey } = useAppSelector((state) => state.keys)

  const [profiles, setProfiles] = useState<(MetaEvent & { score: number })[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  const getTopRankedEvents = async () => {
    try {
      setIsLoading(true)
      setIsEmpty(false)
      const pubkeysWeightsMap = new Map()

      const mutes = await fetchMuteLists(currentPubkey)
      const distrusted = [
        ...new Set(
          mutes
            .map((e) => e.tags.filter((t) => t.length >= 2 && t[0] === 'p'))
            .flat()
            .map((t) => t[1])
        )
      ]

      const events = await fetchPubkeyEvents({
        cacheOnly: true,
        limit: 2000,
        pubkeys: [currentPubkey]
      })
      events.forEach((e) => {
        const pubkeys = e.tags
          .filter((tag) => tag.length > 1 && tag[0] === 'p')
          .map((t) => t[1])
          .filter((p) => p !== currentPubkey && !distrusted.includes(p))

        pubkeys.forEach((pubkey) => {
          // the more pubkeys a single event mentions,
          // the less weight goes to each one of them
          const weight = getWeight(e) / pubkeys.length
          const total = (pubkeysWeightsMap.get(pubkey) || 0) + weight
          //console.log("weight", pubkey, e.kind, weight, pubkeys.length, total)
          pubkeysWeightsMap.set(pubkey, total)
        })
      })
      const totalWeights = [...pubkeysWeightsMap.values()].reduce((acc, c) => acc + c, 0)

      const pubkeysWithRankingObject: { [pubkey: string]: number } = {}
      pubkeysWeightsMap.forEach((weight, pubkey) => {
        pubkeysWithRankingObject[pubkey] = weight / totalWeights
        //console.log("weight total", pubkey, weight, totalWeights)
      })

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
          // Do not put anyone above 75 score, let the user do it themselves
          const score = Math.ceil((75 * (trustNetScore - minScore * 0.99)) / maxScore)
          return {
            ...meta,
            score
          }
        })
        .filter((m) => !!m.pubkey)

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
