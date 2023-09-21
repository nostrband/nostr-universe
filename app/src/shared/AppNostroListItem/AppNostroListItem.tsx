import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import {
  StyledApp,
  StyledAppAbout,
  StyledAppLastUsed,
  StyledAppName,
  StyledAppPinIcon,
  StyledAppWrap,
  StyledDetailsWrapper
} from './styled'
import { IAppNostroListItem } from './types'
import { AppIcon } from '../AppIcon/AppIcon'

export const AppNostroListItem = ({ app, onClick }: IAppNostroListItem) => {
  return (
    <StyledApp onClick={onClick}>
      <StyledAppWrap>
        {app.pinned && (
          <StyledAppPinIcon>
            <PushPinOutlinedIcon fontSize="small" />
          </StyledAppPinIcon>
        )}

        <AppIcon size="small" isOutline={false} picture={app.picture} alt={app.name} />
      </StyledAppWrap>

      <StyledDetailsWrapper>
        <StyledAppName>{app.name}</StyledAppName>
        <StyledAppAbout> {app.about}</StyledAppAbout>
        {app.lastUsed && <StyledAppLastUsed />}
      </StyledDetailsWrapper>
    </StyledApp>
  )
}
