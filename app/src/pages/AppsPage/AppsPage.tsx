import { useAppSelector } from '@/store/hooks/redux'
import { AppsPageContent } from './AppsPageContent'
import { getSlug } from '@/utils/helpers/general'
import { StyledWrapVisibility } from '../styled'
import { memo } from 'react'

export const AppsPage = memo(function AppsPage() {
  const isShow = useAppSelector((state) => getSlug(state.router.slugs, 'apps'))

  return (
    <StyledWrapVisibility isShow={isShow}>
      <AppsPageContent />
    </StyledWrapVisibility>
  )
})
