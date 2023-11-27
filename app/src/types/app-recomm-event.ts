import { AugmentedEvent } from './augmented-event'

export interface AppRecommEvent extends AugmentedEvent {
  naddrs: string[]
}

export function createAppRecommEvent(e: AugmentedEvent): AppRecommEvent {
  const c = e as AppRecommEvent
  c.naddrs = []
  return c
}
