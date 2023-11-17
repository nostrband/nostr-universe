import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledWebsiteView } from './styled'

export const WebsiteView = ({ url, ...rest }: { url: string }) => {
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const onClick = () => {
    handleOpenContextMenu({ url })
  }

  return (
    <StyledWebsiteView {...rest}>
      Website:
      <span onClick={onClick}>{url}</span>
    </StyledWebsiteView>
  )
}
