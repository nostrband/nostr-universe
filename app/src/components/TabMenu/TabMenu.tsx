import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenApp } from '@/hooks/open-entity'
import { IconButton } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'
//import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import { StyledAvatar, StyledIconButton, StyledTabsActions, StyledWrapper } from './styled'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { selectTab } from '@/store/reducers/tab.slice'

export const TabMenu = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const [searchParams] = useSearchParams()
  const { onStopLoadTab, onReloadTab, backToLastPage } = useOpenApp()
  const id = searchParams.get('tabId') || ''
  const { currentProfile } = useAppSelector((state) => state.profile)
  const currentTab = useAppSelector((state) => selectTab(state, id))

  const handleStopReloadTab = async () => {
    if (currentTab?.loading) {
      await onStopLoadTab(id)
    } else {
      await onReloadTab(id)
    }
  }

  // const handleOpenTabsSwitcher = () => {
  //   handleOpen(MODAL_PARAMS_KEYS.TABS_SWITCHER)
  // }

  const handleCloseTab = () => {
    backToLastPage()
  }

  const handleMagicMenu = () => {
    handleOpen(MODAL_PARAMS_KEYS.CONTEXT_MENU, {
      search: {
        tabId: currentTab?.id || '',
        tabUrl: currentTab?.url || ''
      }
    })
  }

  const handleOpenTabMenu = () => {
    handleOpen(MODAL_PARAMS_KEYS.TAB_MENU, { search: { tabId: id } })
  }

  const handleOpenProfileTabMenu = () => {
    handleOpen(MODAL_PARAMS_KEYS.PROFILE_TAB_MENU_MODAL, { search: { tabId: id } })
  }

  return (
    <StyledWrapper>
      <StyledTabsActions>
        <AppIcon
          isPreviewTab
          isRounded={true}
          picture={currentTab?.icon}
          alt={currentTab?.title}
          onClick={handleOpenTabMenu}
        />
        <StyledIconButton onClick={handleOpenProfileTabMenu}>
          <StyledAvatar src={getProfileImage(currentProfile)} />
        </StyledIconButton>
      </StyledTabsActions>

      <StyledTabsActions>
        <IconButton color="inherit" size="medium" onClick={handleMagicMenu}>
          <AutoFixHighOutlinedIcon />
        </IconButton>
      </StyledTabsActions>

      <StyledTabsActions>
        {/* <IconButton color="inherit" size="medium" onClick={handleOpenTabsSwitcher}>
          <WidgetsOutlinedIcon />
        </IconButton> */}

        <IconButton color="inherit" size="medium" onClick={handleStopReloadTab}>
          {currentTab?.loading ? <CloseOutlinedIcon /> : <ReplayOutlinedIcon />}
        </IconButton>

        <IconButton color="inherit" size="medium" onClick={handleCloseTab}>
          <HomeOutlinedIcon />
        </IconButton>
      </StyledTabsActions>
    </StyledWrapper>
  )
}
