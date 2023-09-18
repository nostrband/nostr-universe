import { AppIcon } from '../AppIcon/AppIcon'
import { StyledAppWraper, StyledAppName } from './styled'
import { IAppNostro } from './types'

export const AppNostro = ({ app, size, hideName, onOpen, isActive, isPreviewTab, disabled }: IAppNostro) => (
  <StyledAppWraper
    onClick={() => {
      if (!disabled) {
        return onOpen(app)
      }
    }}
  >
    <AppIcon size={size} isActive={isActive} isPreviewTab={isPreviewTab} picture={app.picture} alt={app.name} />
    {isPreviewTab ||
      (!hideName && (
        <StyledAppName size={size} component="div">
          {app.name}
        </StyledAppName>
      ))}
  </StyledAppWraper>
)
