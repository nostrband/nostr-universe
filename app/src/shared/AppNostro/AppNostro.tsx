import { StyledApp, StyledAppImg, StyledAppWraper, StyledAppName } from './styled'
import { IAppNostro } from './types'

export const AppNostro = ({ app, size, hideName, onOpen, isActive, isPreviewTab, disabled }: IAppNostro) => (
  <StyledAppWraper
    onClick={() => {
      if (!disabled) {
        return onOpen(app)
      }
    }}
  >
    <StyledApp size={size} isActive={isActive} isPreviewTab={isPreviewTab}>
      <StyledAppImg src={app.picture} />
    </StyledApp>
    {isPreviewTab ||
      (!hideName && (
        <StyledAppName size={size} component="div">
          {app.name}
        </StyledAppName>
      ))}
  </StyledAppWraper>
)
