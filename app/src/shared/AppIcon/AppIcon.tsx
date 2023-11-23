import { memo, useEffect, useState } from 'react'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { StyledAppIcon, StyledAppImg } from './styled'
import { IAppIcon } from './types'

const failedCache = new Map<string, boolean>()

export const AppIcon = memo(function AppIcon({
  picture = '',
  size,
  isActive,
  isPreviewTab,
  isLight,
  isRounded,
  isOutline,
  isSmall,
  alt,
  onClick
}: IAppIcon) {
  const c = failedCache.get(picture)
  const [isFailed, setIsFailed] = useState(c !== undefined ? c : true)

  useEffect(() => {
    const c = failedCache.get(picture)
    if (c !== undefined) {
      setIsFailed(c)
      return
    }
    setIsFailed(true)

    const img = new Image()
    img.src = picture
    img.onerror = () => {
      setIsFailed(true)
      failedCache.set(picture, true)
    }
    img.onload = () => {
      setIsFailed(false)
      failedCache.set(picture, false)
    }
  }, [picture])

  return (
    <StyledAppIcon
      isRounded={isRounded}
      isNotLoaded={isFailed}
      isOutline={isOutline}
      size={size}
      isActive={isActive}
      isPreviewTab={isPreviewTab}
      onClick={onClick}
    >
      {alt ? (
        <StyledAppImg
          isLight={isLight}
          isPreviewTab={isPreviewTab}
          size={size}
          alt={alt}
          isSmall={isSmall}
          src={isFailed ? '' : picture}
        >
          {isFailed && (
            <div className="MuiAvatar-root MuiAvatar-square MuiAvatar-colorDefault">
              {alt.substring(0, 1).toUpperCase()}
            </div>
          )}
        </StyledAppImg>
      ) : (
        <StyledAppImg
          isLight={isLight}
          isPreviewTab={isPreviewTab}
          size={size}
          alt={alt}
          isSmall={isSmall}
          src={isFailed ? '/' : picture}
        >
          <ImageOutlinedIcon fontSize="inherit" />
        </StyledAppImg>
      )}
    </StyledAppIcon>
  )
})
