import { ISyncState, setOnSyncState } from '@/modules/sync'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setSyncState } from '@/store/reducers/sync.slice'
import { useEffect, useCallback } from 'react'

export const useSync = (): ISyncState => {
  const dispatch = useAppDispatch()
  const { syncState } = useAppSelector(state => state.sync)

  const onSyncState = useCallback((s: ISyncState) => {
    dispatch(setSyncState(s))
  }, [dispatch])

  useEffect(() => {
    setOnSyncState(onSyncState)
  }, [onSyncState])

  return syncState
}