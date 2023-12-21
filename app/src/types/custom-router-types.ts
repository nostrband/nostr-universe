export interface Path {
  pathname: string

  search: string

  hash: string
}

export type RelativeRoutingType = 'route' | 'path'
export interface NavigateOptions {
  replace?: boolean
  // eslint-disable-next-line
  state?: any
  preventScrollReset?: boolean
  relative?: RelativeRoutingType
}

export type To = string | Partial<Path>
