import { Box } from '@mui/material'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import {
  StyledApp,
  StyledAppAbout,
  StyledAppIcon,
  StyledAppImg,
  StyledAppName,
  StyledAppPinIcon,
  StyledAppWrap
} from './styled'
import { IAppNostroListItem } from './types'

export const AppNostroListItem = ({ app, onClick }: IAppNostroListItem) => {
  return (
    <StyledApp onClick={onClick}>
      <StyledAppWrap>
        {app.pinned && (
          <StyledAppPinIcon>
            <PushPinOutlinedIcon fontSize="small" />
          </StyledAppPinIcon>
        )}
        <StyledAppIcon>
          <StyledAppImg src={app.picture} />
        </StyledAppIcon>
      </StyledAppWrap>

      <Box>
        <StyledAppName>{app.name}</StyledAppName>
        <StyledAppAbout> {app.about}</StyledAppAbout>
      </Box>
    </StyledApp>
  )
}
