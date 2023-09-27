export interface ITab {
  id: string
  url: string
//  appNaddr: string
  title: string
  icon: string
  order: number
  pubkey: string
  screenshot?: string

  created: boolean
  loading: boolean
  lastActive: number
}
