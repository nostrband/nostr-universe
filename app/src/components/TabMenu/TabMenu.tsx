import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenApp } from '@/hooks/open-entity'
import { IconButton } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import { StyledAvatar, StyledIconButton, StyledTabsActions, StyledWrapper } from './styled'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { ITab } from '@/types/workspace'

export const TabMenu = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const [searchParams] = useSearchParams()
  const { onStopLoadTab, onReloadTab, onHideTab } = useOpenApp()
  const id = searchParams.get('tabId') || ''
  const { openedTabs } = useAppSelector((state) => state.tab)
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const { currentProfile } = useAppSelector((state) => state.profile)
  const currentWorkSpace = workspaces.find((workspace) => workspace.pubkey === currentPubKey)
  const currentTab = currentWorkSpace?.tabs.find((tab) => tab.id === id) as ITab
  const tabState = openedTabs.find((t) => t.id === id)

  const handleStopReloadTab = async () => {
    if (tabState?.loading) {
      await onStopLoadTab(id)
    } else {
      await onReloadTab(id)
    }
  }

  const handleOpenTabsSwitcher = () => {
    handleOpen(MODAL_PARAMS_KEYS.TABS_SWITCHER, { replace: true })
  }

  return (
    <StyledWrapper>
      <StyledTabsActions>
        <StyledIconButton
          onClick={() => handleOpen(MODAL_PARAMS_KEYS.PROFILE_TAB_MENU_MODAL, { search: { tabId: id }, replace: true })}
        >
          <StyledAvatar src={getProfileImage(currentProfile)} />
        </StyledIconButton>
        <AppIcon
          isActive
          isPreviewTab
          picture={tabState?.picture || currentTab?.icon}
          alt={currentTab?.title}
          onClick={() => handleOpen(MODAL_PARAMS_KEYS.TAB_MENU, { search: { tabId: id }, replace: true })}
        />
      </StyledTabsActions>

      <StyledTabsActions>
        <IconButton
          color="inherit"
          size="medium"
          onClick={() =>
            handleOpen(MODAL_PARAMS_KEYS.CONTEXT_MENU, {
              search: { nostrId: currentTab.url },
              replace: true
            })
          }
        >
          <AutoFixHighOutlinedIcon />
        </IconButton>

        <IconButton color="inherit" size="medium" onClick={handleOpenTabsSwitcher}>
          <WidgetsOutlinedIcon />
        </IconButton>

        <IconButton color="inherit" size="medium" onClick={handleStopReloadTab}>
          {tabState?.loading ? <CloseOutlinedIcon /> : <ReplayOutlinedIcon />}
        </IconButton>

        <IconButton color="inherit" size="medium" onClick={onHideTab}>
          <HomeOutlinedIcon />
        </IconButton>
      </StyledTabsActions>
    </StyledWrapper>
  )
}
