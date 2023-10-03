import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useOpenApp } from '@/hooks/open-entity'
import { TabMenu } from '@/components/TabMenu/TabMenu'
import { StyledViewName, StyledWrap } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { selectTab } from '@/store/reducers/tab.slice'

export const TabPageContent = () => {
  const { openTabWindow, onHideTabInBrowser } = useOpenApp()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('tabId') || ''
  const tab = useAppSelector((state) => selectTab(state, id))
  const tabExists: boolean = !!tab
  // return to home if we're trying to access a non-existent tab
  useEffect(() => {
    if (id && !tabExists) navigate('/', { replace: true })
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
