import { useEffect, useState, useCallback } from 'react'

interface IState {
  next: (() => Promise<void>) | null
  active: boolean
  lastStartTime: number
  timeout: any
}

export const useAsyncThrottle = (interval?: number) => {
  const [state, setState] = useState<IState>({
    next: null,
    active: false,
    lastStartTime: 0,
    timeout: null
  })

  const runNext = useCallback(async () => {
    if (!state.active && state.next !== null) {
      const next = state.next
      setState(s => ({ ...s, next: null, active: true, lastStartTime: Date.now() }))
      await next()
      setState(s => ({ ...s, active: false }))
    }
  }, [state, setState])

  useEffect(() => {
    const passed = Date.now() - state.lastStartTime
    if (!interval || passed > interval) {
      runNext()
    } else if (!state.timeout) {

      const timeout = setTimeout(() => {
        setState(s => ({ ...s, timeout: null }))
        runNext()
      }, interval - passed)

      setState(s => {
        clearTimeout(s.timeout)
        return { ...s, timeout }
      })
    }
  }, [runNext])

  return async (fn: () => Promise<void>) => {
    setState(s => ({ ...s, next: fn }))
  }
}

