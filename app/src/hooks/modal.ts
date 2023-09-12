import { useNavigate, useSearchParams, createSearchParams, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

type SearchParamsType = {
  [key: string]: string
}

type IExtraOptions = {
  search?: SearchParamsType
  replace?: boolean
}

export const useOpenModalSearchParams = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const getSearchParamsLength = Object.keys(queryString.parse(location.search)).length
  const getEnumParam = (modal: MODAL_PARAMS_KEYS) =>
    Object.keys(MODAL_PARAMS_KEYS)[Object.values(MODAL_PARAMS_KEYS).indexOf(modal)]

  const handleOpen = (modal: MODAL_PARAMS_KEYS, extraOptions?: IExtraOptions) => {
    const enumKey = getEnumParam(modal)

    let searchParamsData: SearchParamsType = { [enumKey]: modal }
    if (extraOptions?.search) {
      searchParamsData = { ...searchParamsData, ...extraOptions.search }
    }

    const searchString =
      extraOptions?.replace || extraOptions?.search || !getSearchParamsLength
        ? createSearchParams(searchParamsData).toString()
        : `${location.search}&${createSearchParams(searchParamsData).toString()}`

    navigate(
      {
        pathname: '/',
        search: searchString
      },
      { replace: false }
    )
  }

  const handleClose = (path?: string) => {
    console.log('CLOSE FROM API')
    if (path) {
      console.log('PATH CLOSE', path)
      navigate('/', { replace: true })
    } else {
      navigate(-1)
    }
  }

  const getModalOpened = (modal: MODAL_PARAMS_KEYS) => {
    const enumKey = getEnumParam(modal)
    const modalOpened = searchParams.get(enumKey) === modal

    return modalOpened
  }

  return {
    handleClose,
    handleOpen,
    getModalOpened
  }
}
