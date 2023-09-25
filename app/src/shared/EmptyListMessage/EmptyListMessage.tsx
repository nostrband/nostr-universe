import { FC } from 'react'
import { StyledMessage, StyledReloadButton } from './styled'

type EmptyListMessageProps = {
  onReload?: () => void
}

export const EmptyListMessage: FC<EmptyListMessageProps> = ({ onReload = () => {} }) => {
  return (
    <StyledMessage>
      Nothing here, <StyledReloadButton onClick={onReload}>reload</StyledReloadButton>
    </StyledMessage>
  )
}
