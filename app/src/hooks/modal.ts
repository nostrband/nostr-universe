import { useNavigate, useSearchParams, createSearchParams, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useCallback } from 'react'
import { AugmentedEvent } from '@/types/augmented-event'
import { getEventNip19, getNprofile } from '@/modules/nostr'

type SearchParamsType = {
  [key: string]: string
}

export type IExtraOptions = {
  search?: SearchParamsType
  replace?: boolean
  append?: boolean
}

export interface IContextMenuParams {
  event?: AugmentedEvent
  pubkey?: string
  bech32?: string
  url?: string
  replace?: boolean
  append?: boolean
}

export const useOpenModalSearchParams = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const getEnumParam = useCallback((modal: MODAL_PARAMS_KEYS) => {
    return Object.keys(MODAL_PARAMS_KEYS)[Object.values(MODAL_PARAMS_KEYS).indexOf(modal)]
  }, [])

  const handleOpen = useCallback(
    (modal: MODAL_PARAMS_KEYS, extraOptions?: IExtraOptions) => {
      const enumKey = getEnumParam(modal)
      const getSearchParamsLength = Object.keys(queryString.parse(location.search)).length

      let searchParamsData: SearchParamsType = { [enumKey]: modal }
      if (extraOptions?.search) {
        searchParamsData = { ...searchParamsData, ...extraOptions.search }
      }

      const searchString =
        !extraOptions?.append || !getSearchParamsLength
          ? createSearchParams(searchParamsData).toString()
          : `${location.search}&${createSearchParams(searchParamsData).toString()}`

      navigate(
        {
          pathname: location.pathname,
          search: searchString
        },
        { replace: extraOptions?.replace }
      )
    },
    [location, navigate, getEnumParam]
  )

  const handleClose = useCallback(
    (path?: string) => {
      if (path) {
        console.log('path close', path)
        navigate(path, { replace: true })
      } else {
        navigate(-1)
      }
    },
    [navigate]
  )

  const getModalOpened = useCallback(
    (modal: MODAL_PARAMS_KEYS) => {
      const enumKey = getEnumParam(modal)
      const modalOpened = searchParams.get(enumKey) === modal

      return modalOpened
    },
    [getEnumParam, searchParams]
  )

  const handleOpenContextMenu = useCallback(
    ({ event, pubkey = '', bech32 = '', url = '', replace = false, append = false }: IContextMenuParams) => {
      if (!bech32 && event) bech32 = getEventNip19(event)
      if (!bech32 && pubkey) bech32 = getNprofile(pubkey)

      handleOpen(MODAL_PARAMS_KEYS.CONTEXT_MENU, {
        search: {
          bech32: bech32,
          href: url
        },
        replace,
        append
      })
    },
    [handleOpen]
  )

  const handleOpenTab = useCallback(
    // eslint-disable-next-line
    (tabId: string, options?: any) => {
      handleOpen(MODAL_PARAMS_KEYS.TAB_MODAL, {
        search: { tabId },
        ...options
      })
    },
    [handleOpen]
  )

  return {
    handleClose,
    handleOpen,
    getModalOpened,
    handleOpenContextMenu,
    handleOpenTab
  }
}
