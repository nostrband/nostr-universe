import { useSearchParams } from 'react-router-dom'
import { Avatar, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { Header as HeaderLayout } from '@/layout/Header/Header'
import { useAppSelector } from '@/store/hooks/redux'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { StyledContainerButton, StyledIconButton, StyledWrapper } from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'

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

        <StyledContainerButton>
          <IconButton
            color="inherit"
            size="medium"
            onClick={() => handleOpen(MODAL_PARAMS_KEYS.WALLET_MODAL, { replace: true })}
          >
            <AccountBalanceWalletOutlinedIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="medium"
            onClick={() => handleOpen(MODAL_PARAMS_KEYS.SEARCH_MODAL, { replace: true })}
          >
            <SearchIcon />
          </IconButton>

          <IconButton
            color="inherit"
            size="medium"
            onClick={() => handleOpen(MODAL_PARAMS_KEYS.TAB_MENU, { search: { tabId: id }, replace: true })}
          >
            <MoreVertIcon />
          </IconButton>
        </StyledContainerButton>
      </HeaderLayout>
    </StyledWrapper>
  )
}
