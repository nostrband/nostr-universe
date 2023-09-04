import { Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Header as HeaderLayout } from '@/layout/Header/Header'
import { useAppSelector } from '@/store/hooks/redux'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { StyledIconButton, StyledWrapper } from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'

export const Header = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { currentProfile } = useAppSelector((state) => state.profile)
  const { isOpenTabWindow } = useAppSelector((state) => state.tab)

  return (
    <StyledWrapper>
      <HeaderLayout>
        <StyledIconButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.PROFILE_PAGE)}>
          <Avatar src={getProfileImage(currentProfile)} />
        </StyledIconButton>

        <div>
          <IconButton color="inherit" size="medium" onClick={() => handleOpen(MODAL_PARAMS_KEYS.SEARCH_MODAL)}>
            <SearchIcon />
          </IconButton>
          {isOpenTabWindow && (
            <IconButton color="inherit" size="medium" onClick={() => handleOpen(MODAL_PARAMS_KEYS.CONTEXT_MENU)}>
              <MoreVertIcon />
            </IconButton>
          )}
        </div>
      </HeaderLayout>
    </StyledWrapper>
  )
}
