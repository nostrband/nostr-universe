import { useNavigate, useSearchParams, createSearchParams, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

type IExtraOptions = {
  search?: [string, string]
  replace?: boolean
}

type SearchParamsType = {
  [key: string | MODAL_PARAMS_KEYS]: string | MODAL_PARAMS_KEYS
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

    const searchParamsData: SearchParamsType = { [enumKey]: modal }
    if (extraOptions?.search) {
      searchParamsData[extraOptions.search[0]] = extraOptions.search[1]
    }

    const searchString =
      extraOptions?.search || !getSearchParamsLength
        ? createSearchParams(searchParamsData).toString()
        : `${location.search}&${createSearchParams(searchParamsData).toString()}`

    navigate(
      {
        pathname: '/',
        search: searchString
      },
      { replace: extraOptions?.replace || false }
    )
  }

  const handleClose = () => {
    navigate(-1)
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
