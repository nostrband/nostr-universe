import { StyledApp, StyledAppImg, StyledAppWraper, StyledAppName } from './styled'
import { IAppNostro } from './types'

export const AppNostro = ({ app, size, hideName }: IAppNostro) => (
  <StyledAppWraper>
    <StyledApp size={size}>
      <StyledAppImg src={app.img} />
    </StyledApp>
    {!hideName && (
      <StyledAppName size={size} component="div">
        {app.name}
      </StyledAppName>
    )}
  </StyledAppWraper>
)
