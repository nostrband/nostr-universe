import { FC, PropsWithChildren } from 'react'
import { StyledCircularProgress, StyledLoadingContainer } from './styled'

export const LoadingSpinner = () => {
  return <StyledCircularProgress />
}

export const LoadingContainer: FC<PropsWithChildren> = ({ children }) => {
  return <StyledLoadingContainer>{children}</StyledLoadingContainer>
}
