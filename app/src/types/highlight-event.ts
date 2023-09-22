import { AuthoredEvent } from "./authored-event";

export interface HighlightEvent extends AuthoredEvent {
  // TBD
}

export function createHighlightEvent(e: AuthoredEvent): HighlightEvent {
  const c = e as HighlightEvent
  // 
  return c
}