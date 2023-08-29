import { useSearchParams } from 'react-router-dom'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

type IExtraOptions = {
  key: string
  value: string
}

export const useOpenModalSearchParams = (modal: MODAL_PARAMS_KEYS) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const enumKey = Object.keys(MODAL_PARAMS_KEYS)[Object.values(MODAL_PARAMS_KEYS).indexOf(modal)]

  const handleOpen = (extraOptions?: IExtraOptions) => {
    setSearchParams((prevSearchParams) => {
      const u = new URLSearchParams(prevSearchParams)
      u.set(enumKey, modal)
      if (extraOptions) {
        console.log(extraOptions)
        u.set(extraOptions.key, extraOptions.value)
      }
      return u
    })
  }

  const handleClose = (extraOptionsDelete?: string) => {
    setSearchParams((prevSearchParams) => {
      const u = new URLSearchParams(prevSearchParams)
      u.delete(enumKey)
      if (extraOptionsDelete) {
        u.delete(extraOptionsDelete)
      }
      return u
    })
  }

  const open = searchParams.get(enumKey) === modal

  return {
    open,
    handleClose,
    handleOpen
  }
}
