import { useProfileImageSource } from '@/hooks/profile-image'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { IAccount } from '../ModalAccounts/types'
import { FC } from 'react'
import { StyledName, StyledProfileAvatar, StyledWrapper } from './styled'
import { getProfileName } from '@/utils/helpers/prepare-data'

type ItemProfileProps = IAccount & {
  onChangeAccount: () => void
}

export const ItemProfile: FC<ItemProfileProps> = ({ onChangeAccount, ...props }) => {
  const { pubkey, profile } = props
  const name = getProfileName(pubkey, props)

  const { url, viewRef } = useProfileImageSource({
    pubkey: pubkey,
    originalImage: profile?.picture
  })

  return (
    <StyledWrapper onClick={onChangeAccount}>
      <Head>
        <StyledProfileAvatar src={url} ref={viewRef} imgProps={{ loading: 'lazy' }} />
      </Head>
      <StyledName>{name}</StyledName>
    </StyledWrapper>
  )
}
