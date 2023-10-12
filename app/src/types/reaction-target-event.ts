import { AuthoredEvent } from "./authored-event";
import { EventAddr } from "./event-addr";

export interface ReactionTargetEvent extends AuthoredEvent {
  targetAddr?: EventAddr
  targetEvent?: AuthoredEvent
}

export function createReactionTargetEvent(e: AuthoredEvent): ReactionTargetEvent {
  const c = e as ReactionTargetEvent
  // all fields optional
  return c
}