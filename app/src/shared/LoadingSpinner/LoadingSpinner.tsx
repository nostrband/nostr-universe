import { FC, PropsWithChildren } from 'react'
import { StyledCircularProgress, StyledLoadingContainer } from './styled'
import { CircularProgressProps } from '@mui/material'

export const LoadingSpinner = (props: CircularProgressProps) => {
  return <StyledCircularProgress {...props} />
}

export const LoadingContainer: FC<PropsWithChildren> = ({ children }) => {
  return <StyledLoadingContainer>{children}</StyledLoadingContainer>
}
