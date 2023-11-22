import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledWebsiteView } from './styled'

export const WebsiteView = ({ url, isOpenLink = true, ...rest }: { url: string; isOpenLink?: boolean }) => {
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const onClick = () => {
    if (isOpenLink) {
      handleOpenContextMenu({ url })
    }
  }

  return (
    <StyledWebsiteView {...rest}>
      Website:
      <span onClick={onClick}>{url}</span>
    </StyledWebsiteView>
  )
}
