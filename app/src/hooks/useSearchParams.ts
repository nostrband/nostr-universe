import { useAppSelector } from '@/store/hooks/redux.ts'
import { useCallback } from 'react'

export const useSearchParams = () => {
  const url = useAppSelector((state) => state.router.url)

  const params = new URLSearchParams(url)

  const getSearchParams = useCallback(
    (name: string): string => {
      return params.get(name) || ''
    },
    [params]
  )

  return getSearchParams
}
