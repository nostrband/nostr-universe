import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledWebsiteView } from './styled'

export const WebsiteView = ({ url, isOpenLink = true, ...rest }: { url: string; isOpenLink?: boolean }) => {
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const onClick = () => {
    if (isOpenLink) {
      let u = url
      if (!u.split('.')[0].includes(':'))
        u = "https://" + u
      handleOpenContextMenu({ url: u })
    }
  }

  return (
    <StyledWebsiteView {...rest}>
      <span onClick={onClick}>{url}</span>
    </StyledWebsiteView>
  )
}
