import { useNavigate, useSearchParams, createSearchParams, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useCallback } from 'react'

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
        extraOptions?.replace || !getSearchParamsLength
          ? createSearchParams(searchParamsData).toString()
          : `${location.search}&${createSearchParams(searchParamsData).toString()}`

      navigate(
        {
          pathname: '/',
          search: searchString
        },
        { replace: false }
      )
    },
    [searchParams, location, navigate, getEnumParam]
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

  return {
    handleClose,
    handleOpen,
    getModalOpened
  }
}
