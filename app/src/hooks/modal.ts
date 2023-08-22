import { useSearchParams } from 'react-router-dom'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const useOpenModalSearchParams = (modal: MODAL_PARAMS_KEYS) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleOpen = () => {
    setSearchParams(`modal=${modal}`)
  }

  const handleClose = () => {
    setSearchParams('')
  }

  const open = searchParams.get('modal') === modal

  return {
    open,
    handleClose,
    handleOpen
  }
}
