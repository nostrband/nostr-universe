import { Avatar, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Header as HeaderLayout } from '@/layout/Header/Header'
import { useAppSelector } from '@/store/hooks/redux'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { StyledIconButton, StyledWrapper } from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useSearchParams } from 'react-router-dom'

export const Header = () => {
  const [searchParams] = useSearchParams()
  const { handleOpen } = useOpenModalSearchParams()
  const { currentProfile } = useAppSelector((state) => state.profile)
  const id = searchParams.get('id') || ''

  return (
    <StyledWrapper>
      <HeaderLayout>
        <StyledIconButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.PROFILE_PAGE, { replace: true })}>
          <Avatar src={getProfileImage(currentProfile)} />
        </StyledIconButton>

        <IconButton
          color="inherit"
          size="medium"
          onClick={() => handleOpen(MODAL_PARAMS_KEYS.TAB_MENU, { search: { id: id }, replace: true })}
        >
          <MoreVertIcon />
        </IconButton>
      </HeaderLayout>
    </StyledWrapper>
  )
}
