import { useEffect } from 'react'
import { useOpenApp } from '@/hooks/open-entity'
import { TabMenu } from '@/components/TabMenu/TabMenu'
import { StyledViewName, StyledWrap } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { selectTab } from '@/store/reducers/tab.slice'
import { useCustomNavigate, useCustomSearchParams } from '@/hooks/navigate'

export const TabPageContent = () => {
  const { openTabWindow, onHideTabInBrowser } = useOpenApp()
  const navigate = useCustomNavigate()
  const getSearchParams = useCustomSearchParams()
  const id = getSearchParams('tabId')
  const tab = useAppSelector((state) => selectTab(state, id))
  const tabExists: boolean = !!tab
  // return to home if we're trying to access a non-existent tab
  useEffect(() => {
    if (id && !tabExists) navigate({ pathname: '/', search: '?page=apps' }, { replace: true })
  }, [id, tab])

  useEffect(() => {
    if (id && tabExists) {
      openTabWindow(id)
      return () => {
        onHideTabInBrowser(id)
      }
    }
  }, [id, tabExists])

  return (
    <>
      <StyledWrap>
        <AppIcon size="medium" picture={tab?.icon} isOutline={false} alt={tab?.title} />
        <StyledViewName>{tab?.title}</StyledViewName>
        {tab?.loading && <StyledViewName variant="body2">Loading...</StyledViewName>}
      </StyledWrap>

      <TabMenu />
    </>
  )
}
