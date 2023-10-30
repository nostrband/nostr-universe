import { dbi } from '@/modules/db'
import { SearchTerm } from '@/modules/types/db'
import { useAppSelector } from '@/store/hooks/redux'
import { useCallback, useEffect, useState } from 'react'

const MAX_HISTORY = 10

export const useSearchHistory = () => {
  const { currentPubkey } = useAppSelector((state) => state.keys)

  const [searchHistory, setSearchHistory] = useState<SearchTerm[]>([])
  const [isSearchHistoryLoading, setIsSearchHistoryLoading] = useState(false)

  const updateSearchHistory = useCallback(
    (history: SearchTerm[]) => {
      history.sort((a, b) => a.value.localeCompare(b.value))

      const filtered = history
        .map((e, i, a) => {
          if (!i || a[i - 1].value !== e.value) return e
        })
        .filter((e) => e !== undefined)
        .slice(0, MAX_HISTORY) as SearchTerm[]

      filtered.sort((a, b) => b.timestamp - a.timestamp)

      setSearchHistory(filtered)
    },
    [setSearchHistory]
  )

  const getSearchHistory = useCallback(async () => {
    if (!currentPubkey) return undefined

    setIsSearchHistoryLoading(true)
    const history = await dbi
      .getSearchHistory(currentPubkey, MAX_HISTORY * 10)
      .finally(() => setIsSearchHistoryLoading(false))

    if (history) {
      updateSearchHistory(history)
    }
  }, [currentPubkey, updateSearchHistory])

  useEffect(() => {
    getSearchHistory()
  }, [getSearchHistory])

  const deleteSearchTermHandler = useCallback(
    (id: string) => {
      dbi.deleteSearchTerm(id).then(getSearchHistory)
    },
    [getSearchHistory]
  )

  return {
    searchHistory,
    isSearchHistoryLoading,
    handleDeleteSearchTerm: deleteSearchTermHandler
  }
}
