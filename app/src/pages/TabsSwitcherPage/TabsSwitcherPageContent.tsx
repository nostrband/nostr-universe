import { MouseEvent, memo, useCallback } from 'react'
import { Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Container } from '@/layout/Container/Conatiner'
import { StyledHeadTabGroup, StyledCloseTabBtn, StyledTabWrap, StyledTitle } from './styled'
import { useOpenApp } from '@/hooks/open-entity'
import { useAppSelector } from '@/store/hooks/redux'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { ITabGroup, selectTabGroups } from '@/store/store'
import { ITab } from '@/types/tab'
import { StyledWrapVisibility } from '../styled'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { getSlug } from '@/utils/helpers/general'

export const TabsSwitcherPageContent = memo(function TabsSwitcherPageContent() {
  const isOpen = useAppSelector((state) => getSlug(state, 'tabs-switcher'))
  const { onSwitchTab, onCloseTab, onCloseTabs } = useOpenApp()
  const tgs = useAppSelector(selectTabGroups)

  const handleOpen = useCallback(
    async (tab: ITab) => {
      await onSwitchTab(tab)
    },
    [onSwitchTab]
  )

  const handleCloseTab = useCallback(
    (e: MouseEvent<HTMLButtonElement>, id: string) => {
      e.stopPropagation()
      onCloseTab(id)
    },
    [onCloseTab]
  )

  const handleCloseTabGroup = useCallback(
    (tg: ITabGroup) => {
      onCloseTabs(tg.tabs)
    },
    [onCloseTabs]
  )

  return (
    <StyledWrapVisibility isShow={isOpen}>
      {!tgs.length ? (
        <>No active tabs.</>
      ) : (
        tgs.map((tg) => {
          const info = tg.tabs[0]
          return (
            <Box key={tg.id} marginTop="10px">
              <Container>
                <StyledHeadTabGroup>
                  <AppIcon isPreviewTab isRounded={true} picture={info.icon} alt={info.title} />
                  <StyledTitle>{info.title}</StyledTitle>
                  <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    onClick={() => handleCloseTabGroup(tg)}
                  >
                    <CloseIcon />
                  </IconButton>
                </StyledHeadTabGroup>
              </Container>

              <HorizontalSwipeContent>
                {tg.tabs.map((tab) => (
                  <StyledTabWrap key={tab.id} onClick={() => handleOpen(tab)}>
                    <StyledCloseTabBtn
                      size="small"
                      edge="start"
                      color="inherit"
                      aria-label="close"
                      onClick={(e) => handleCloseTab(e, tab.id)}
                    >
                      <CloseIcon />
                    </StyledCloseTabBtn>
                    <AppIcon
                      size="big"
                      isSmall={!tab.screenshot}
                      picture={tab.screenshot || tab.icon}
                      alt={tab.title}
                    />
                  </StyledTabWrap>
                ))}
              </HorizontalSwipeContent>
            </Box>
          )
        })
      )}
    </StyledWrapVisibility>
  )
})
