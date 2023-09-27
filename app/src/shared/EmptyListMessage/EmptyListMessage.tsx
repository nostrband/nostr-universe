import { FC } from 'react'
import { StyledMessage, StyledReloadButton } from './styled'

type EmptyListMessageProps = {
  onReload?: () => void
  message?: string
}

export const EmptyListMessage: FC<EmptyListMessageProps> = ({
  onReload = () => {},
  message = 'Nothing here',
  ...restProps
}) => {
  return (
    <StyledMessage {...restProps}>
      {message}, <StyledReloadButton onClick={onReload}>reload</StyledReloadButton>
    </StyledMessage>
  )
}
