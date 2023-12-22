import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useCallback } from 'react'
import { AugmentedEvent } from '@/types/augmented-event'
import { getEventNip19, getNprofile } from '@/modules/nostr'
import { useCustomNavigate } from '@/hooks/navigate'

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

const getEnumParam = (modal: MODAL_PARAMS_KEYS) => {
  return Object.keys(MODAL_PARAMS_KEYS)[Object.values(MODAL_PARAMS_KEYS).indexOf(modal)]
}

export const useOpenModalSearchParams = () => {
  const navigate = useCustomNavigate()

  const handleOpen = useCallback(
    (modal: MODAL_PARAMS_KEYS, extraOptions?: IExtraOptions) => {
      const enumKey = getEnumParam(modal)

      let searchParamsData: SearchParamsType = { [enumKey]: modal }
      if (extraOptions?.search) {
        searchParamsData = { ...searchParamsData, ...extraOptions.search }
      }

      navigate(
        {
          search: new URLSearchParams(searchParamsData).toString()
        },
        {
          replace: extraOptions?.replace,
          // we had to move 'append' login into navigate (and change 
          // it's interface) bcs otherwise this hook would be dependent
          // on the current url in redux and would cause rerenders on every 
          // navigation
          append: extraOptions?.append
        }
      )
    },
    [navigate, getEnumParam]
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
    handleOpenContextMenu,
    handleOpenTab
  }
}
