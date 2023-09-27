import { memo, useEffect, useState } from 'react'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { StyledAppIcon, StyledAppImg } from './styled'
import { IAppIcon } from './types'

export const AppIcon = memo(function AppIcon({
  picture = '',
  size,
  isActive,
  isPreviewTab,
  isRounded,
  isOutline,
  alt,
  onClick
}: IAppIcon) {
  const [isFailed, setIsFailed] = useState(false)

  useEffect(() => {
    setIsFailed(false)

    const img = new Image()
    img.src = picture
    img.onerror = () => {
      setIsFailed(true)
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
        <StyledAppImg isPreviewTab={isPreviewTab} size={size} alt={alt} src={isFailed ? '/' : picture} />
      ) : (
        <StyledAppImg isPreviewTab={isPreviewTab} size={size} alt={alt} src={isFailed ? '/' : picture}>
          <ImageOutlinedIcon fontSize="inherit" />
        </StyledAppImg>
      )}
    </StyledAppIcon>
  )
})
