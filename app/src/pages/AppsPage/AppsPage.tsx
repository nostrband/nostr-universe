import { useAppSelector } from '@/store/hooks/redux'
import { AppsPageContent } from './AppsPageContent'
import { getSlug } from '@/utils/helpers/general'
import { StyledWrapVisibility } from '../styled'
import { memo } from 'react'

export const AppsPage = memo(function AppsPage() {
  const isOpen = useAppSelector((state) => getSlug(state, 'apps'))

  return (
    <StyledWrapVisibility isShow={isOpen}>
      <AppsPageContent />
    </StyledWrapVisibility>
  )
})
