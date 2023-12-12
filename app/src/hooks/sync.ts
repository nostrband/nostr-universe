import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setSyncState } from '@/store/reducers/sync.slice'
import { useEffect, useCallback } from 'react'
import { ISyncState } from '@/types/sync-state'
import { proxy } from 'comlink'
import { worker } from '@/workers/client'

export const useSync = (): ISyncState => {
  const dispatch = useAppDispatch()
  const { syncState } = useAppSelector((state) => state.sync)

  const onSyncState = useCallback(
    (s: ISyncState) => {
      dispatch(setSyncState(s))
    },
    [dispatch]
  )

  useEffect(() => {
    worker.syncSetOnState(proxy(onSyncState))
  }, [onSyncState])

  return syncState
}
