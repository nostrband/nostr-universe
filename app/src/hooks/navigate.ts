import { useAppDispatch, useAppSelector } from '@/store/hooks/redux.ts'
import { navigate, onPopState } from '@/store/reducers/router.slice.ts'
import { useCallback } from 'react'
import { NavigateOptions, To } from '@/types/custom-router-types.ts'

type CustomNavigateOptions = NavigateOptions & { append?: boolean }
interface NavigateFunction {
  (to: To, options?: CustomNavigateOptions): void
  (delta: number): void
}

export const useCustomSearchParams = () => {
  const url = useAppSelector((state) => state.router.url)

  const params = new URL(url, window.location.href).searchParams

  const getSearchParams = useCallback(
    (name: string): string => {
      return params.get(name) || ''
    },
    [params]
  )

  return getSearchParams
}

export const useCustomNavigate = () => {
  const dispatch = useAppDispatch()

  const customNavigate: NavigateFunction = useCallback(
    (arg1: To | number, arg2?: CustomNavigateOptions | number) => {
      if (typeof arg1 === 'number') {
        // we keep our router in sync w/ window.location and 
        // 'back/forward' actions are sent to the window so it
        // updates the window.history stack, and
        // then reacted-to by onPopState below to update our
        // internal url
        window.history.go(arg1)
      } else {
        const to: To = arg1
        const options: CustomNavigateOptions | undefined = arg2 as CustomNavigateOptions | undefined

        dispatch(
          navigate({
            to,
            options
          })
        )
      }
    },
    [dispatch]
  )

  return customNavigate
}

export const initCustomNavigate = (dispatch: ReturnType<typeof useAppDispatch>) => {

  // cordova
  document.addEventListener("backbutton", (e) => {
    console.log("back", e)
    if (window.history.length > 0)
      window.history.go(-1)
  })

  window.addEventListener("popstate", (e) => {
    console.log("pop state", e)
    dispatch(onPopState())
  })

}