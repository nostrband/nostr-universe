import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks/redux'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { ITab } from '@/types/workspace'
import { useOpenApp } from '@/hooks/open-entity'
import { AppNostro as AppNostroType } from '@/types/app-nostro'
import { IconButton } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'
import { StyledTabsActions, StyledWrapper } from './styled'

export const TabMenu = () => {
  const [searchParams] = useSearchParams()
  const { onSwitchTab, onHideTabInBrowser, onStopLoadTab, onReloadTab, onHideTab } = useOpenApp()
  const id = searchParams.get('id')
  const { isLoading } = useAppSelector((state) => state.tab)
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const currentTab = currentWorkSpace.tabs.find((tab) => tab.id === id)

  const handleSwitchTab = async (tab: AppNostroType) => {
    if (currentTab) {
      await onHideTabInBrowser(currentTab.id)
      await onSwitchTab(tab)
    }
  }

  const handleStopReloadTab = async () => {
    if (isLoading) {
      await onStopLoadTab()
    } else {
      await onReloadTab()
    }
  }

  const getTabsFromCurrentWorkSpace = currentWorkSpace.tabGroups.find((tab) => tab.id === currentTab?.appNaddr)

  const getTabs = getTabsFromCurrentWorkSpace?.tabs
    .map((tab) => {
      return currentWorkSpace.tabs.find(({ id }) => id === tab)
    })
    .filter((tab): tab is ITab => !!tab)

  return (
    <StyledWrapper>
      <StyledTabsActions>
        {getTabs &&
          currentTab &&
          getTabs.map((tab) => {
            const app = {
              picture: tab.icon,
              name: tab.title,
              naddr: tab.appNaddr,
              url: tab.url,
              order: tab.order,
              id: tab.id
            }

            const isActive = currentTab.id === tab.id
            return (
              <AppNostro
                key={tab.id}
                isPreviewTab
                app={app}
                disabled={isActive}
                isActive={isActive}
                hideName
                onOpen={handleSwitchTab}
              />
            )
          })}
      </StyledTabsActions>

      <StyledTabsActions>
        <IconButton color="inherit" size="medium" onClick={handleStopReloadTab}>
          {isLoading ? <CloseOutlinedIcon /> : <ReplayOutlinedIcon />}
        </IconButton>

        <IconButton color="inherit" size="medium" onClick={onHideTab}>
          <HomeOutlinedIcon />
        </IconButton>
      </StyledTabsActions>
    </StyledWrapper>
  )
}
