import { useState } from 'react'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { StyledAppIcon, StyledAppImg } from './styled'
import { IAppIcon } from './types'

export const AppIcon = ({ picture = '', size, isActive, isPreviewTab, isOutline, alt }: IAppIcon) => {
  const [isNotLoaded, setIsLoaded] = useState(false)

  const img = new Image()
  img.src = picture

  img.onerror = () => {
    setIsLoaded(true)
  }

  return (
    <StyledAppIcon
      isNotLoaded={isNotLoaded}
      isOutline={isOutline}
      size={size}
      isActive={isActive}
      isPreviewTab={isPreviewTab}
    >
      {alt ? (
        <StyledAppImg isPreviewTab={isPreviewTab} size={size} alt={alt} src={isNotLoaded ? '/' : picture} />
      ) : (
        <StyledAppImg isPreviewTab={isPreviewTab} size={size} alt={alt} src={isNotLoaded ? '/' : picture}>
          <ImageOutlinedIcon fontSize="inherit" />
        </StyledAppImg>
      )}
    </StyledAppIcon>
  )
}
