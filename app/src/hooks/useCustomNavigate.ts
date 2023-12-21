import { useAppDispatch } from '@/store/hooks/redux.ts'
import { forwardBack, navigate } from '@/store/reducers/router.slice.ts'
import { To, NavigateOptions } from 'react-router-dom'
import { useCallback } from 'react'

type CustomNavigateOptions = NavigateOptions & { append?: boolean }
interface NavigateFunction {
  (to: To, options?: CustomNavigateOptions): void
  (delta: number): void
}

export const useCustomNavigate = () => {
  const dispatch = useAppDispatch()

  const customNavigate: NavigateFunction = useCallback(
    (arg1: To | number, arg2?: CustomNavigateOptions | number) => {
      if (typeof arg1 === 'number') {
        dispatch(forwardBack())
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
