import { memo, useCallback } from 'react'
import { AppIcon } from '../AppIcon/AppIcon'
import { StyledAppWraper, StyledAppName } from './styled'
import { IAppNostro } from './types'

export const AppNostro = memo(function AppNostro({
  app,
  size,
  hideName,
  onOpen,
  isActive,
  isPreviewTab,
  disabled,
  containerProps
}: IAppNostro) {
  const handleAppClick = useCallback(() => {
    if (!disabled) {
      return onOpen(app)
    }
  }, [disabled, onOpen])

  return (
    <StyledAppWraper onClick={handleAppClick} {...containerProps}>
      <AppIcon size={size} isActive={isActive} isPreviewTab={isPreviewTab} picture={app.picture} alt={app.name} />
      {isPreviewTab ||
        (!hideName && (
          <StyledAppName size={size} component="div">
            {app.name}
          </StyledAppName>
        ))}
    </StyledAppWraper>
  )
})
