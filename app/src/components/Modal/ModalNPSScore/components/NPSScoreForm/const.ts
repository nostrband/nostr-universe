import { MetaEvent } from '@/types/meta-event'

export const ANONYM = 'anon'

export const getUsername = (user: MetaEvent | null) => {
  return user?.profile?.display_name || user?.profile?.name || null
}
