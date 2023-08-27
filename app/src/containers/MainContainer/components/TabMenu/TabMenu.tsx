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
  const { openApp } = useOpenApp()
  const { currentTab } = useAppSelector((state) => state.tab)
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)

  const handleOpenApp = async (app: AppNostroType) => {
    await openApp(app)
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
              url: tab.url
            }

            const isActive = currentTab.id === tab.id
            return <AppNostro key={tab.id} isPreviewTab app={app} isActive={isActive} hideName onOpen={handleOpenApp} />
          })}
      </StyledTabsActions>

      <StyledTabsActions>
        <IconButton color="inherit" size="medium">
          <CloseOutlinedIcon />
        </IconButton>

        <IconButton color="inherit" size="medium">
          <ReplayOutlinedIcon />
        </IconButton>

        <IconButton color="inherit" size="medium">
          <HomeOutlinedIcon />
        </IconButton>
      </StyledTabsActions>
    </StyledWrapper>
  )
}
