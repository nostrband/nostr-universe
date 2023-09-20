import { Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { Header as HeaderLayout } from '@/layout/Header/Header'
import { useAppSelector } from '@/store/hooks/redux'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { StyledContainerButton, StyledIconButton, StyledWrapper } from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'

export const Header = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { currentProfile } = useAppSelector((state) => state.profile)

  return (
    <StyledWrapper>
      <HeaderLayout>
        <StyledIconButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.PROFILE_PAGE, { replace: true })}>
          <Avatar src={getProfileImage(currentProfile)} />
        </StyledIconButton>

        <StyledContainerButton>
          <IconButton color="inherit" size="medium" onClick={() => handleOpen(MODAL_PARAMS_KEYS.WALLET_MODAL)}>
            <AccountBalanceWalletOutlinedIcon />
          </IconButton>
          <IconButton color="inherit" size="medium" onClick={() => handleOpen(MODAL_PARAMS_KEYS.SEARCH_MODAL)}>
            <SearchIcon />
          </IconButton>
        </StyledContainerButton>
      </HeaderLayout>
    </StyledWrapper>
  )
}
