import { useLocation, useSearchParams } from 'react-router-dom'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const useOpenModalSearchParams = (modal: MODAL_PARAMS_KEYS) => {
  const { search } = useLocation()
  const [, setSearchParams] = useSearchParams()

  const handleOpen = () => {
    setSearchParams(`modal=${modal}`)
  }

  const handleClose = () => {
    setSearchParams('')
  }

  const query = new URLSearchParams(search)
  const paramField = query.get('modal')

  const open = paramField === modal

  return {
    open,
    handleClose,
    handleOpen
  }
}
