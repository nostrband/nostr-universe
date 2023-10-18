import { Button, Stack } from '@mui/material'
import { Rating } from '../Rating/Rating'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { ActionsContainer, FieldWrapper, StyledLabel, StyledTextarea, SwitchControl } from './styled'
import { FC, FormEvent, useState } from 'react'
import { getProfileName } from '@/utils/helpers/prepare-data'
import { useAppSelector } from '@/store/hooks/redux'
import { selectIsGuest, selectKeys } from '@/store/store'
import { ANSWER_FIELDS, NPSScoreFormProps } from './types'

export const NPSScoreForm: FC<NPSScoreFormProps> = ({ onSubmit }) => {
  const { handleClose } = useOpenModalSearchParams()
  const { currentPubkey } = useAppSelector(selectKeys)
  const guest = useAppSelector(selectIsGuest)

  const { currentProfile } = useAppSelector((state) => state.profile)

  const [sendAsUser, setSendAsUser] = useState<boolean>(false)

  const username = getProfileName(currentPubkey, currentProfile || undefined)

  const [selectedRating, setSelectedRating] = useState<number | undefined>()

  const [answers, setAnswers] = useState({
    [ANSWER_FIELDS.PRIMARY_REASON]: '',
    [ANSWER_FIELDS.EXPERIENCE_IMPROVEMENT]: ''
  })

  const answersChangeHandler = (key: ANSWER_FIELDS) => {
    return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAnswers((prevState) => ({ ...prevState, [key]: e.target.value }))
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      sendAsUser,
      rating: selectedRating,
      primaryReason: answers[ANSWER_FIELDS.PRIMARY_REASON],
      experienceImprovement: answers[ANSWER_FIELDS.EXPERIENCE_IMPROVEMENT]
    })
  }

  const ratingChangeHandler = (_: unknown, value: number) => {
    if (value || value === 0) {
      setSelectedRating(value)
    }
  }

  const handleSenderTypeChange = (_: unknown, checked: boolean) => {
    if (checked && !guest) {
      return setSendAsUser(true)
    }
    return setSendAsUser(false)
  }

  const isFormValid = Boolean(selectedRating || selectedRating === 0)

  return (
    <form onSubmit={handleSubmit}>
      <FieldWrapper>
        <StyledLabel>
          On a scale 0-10, how likely are you recommend Spring to a friend or colleague?
        </StyledLabel>
        <Rating selectedRating={selectedRating} onRateChange={ratingChangeHandler} />
      </FieldWrapper>

      <FieldWrapper>
        <StyledLabel htmlFor="reason">What is the primary reason for the score you gave us?</StyledLabel>
        <StyledTextarea id="reason" onChange={answersChangeHandler(ANSWER_FIELDS.PRIMARY_REASON)}
          placeholder='optional'
        />
      </FieldWrapper>

      <FieldWrapper>
        <StyledLabel htmlFor="improvement">
          Is there anything specific that Spring can do to improve your experience?
        </StyledLabel>
        <StyledTextarea id="improvement" onChange={answersChangeHandler(ANSWER_FIELDS.EXPERIENCE_IMPROVEMENT)}
          placeholder='optional'
        />
      </FieldWrapper>

      {!guest && (
        <FieldWrapper>
          <Stack direction="row" component="label" alignItems="center">
            <SwitchControl checked={sendAsUser} onChange={handleSenderTypeChange} />
            {!sendAsUser && (<StyledLabel spacing={false}>Send anonymously</StyledLabel>)}
            {sendAsUser && <StyledLabel spacing={false}>Send as «{username}»</StyledLabel>}
          </Stack>
        </FieldWrapper>
      )}

      <FieldWrapper>
        Your feedback will be send as an encrypted direct message on Nostr,
        it is private and you can be as honest as you need to be.
      </FieldWrapper>

      <ActionsContainer>
        <Button className="btn" variant="contained" type="submit" color="actionPrimary" disabled={!isFormValid}>
          Send
        </Button>
        <Button className="btn" variant="contained" type="button" onClick={() => handleClose()} color="actionPrimary">
          Cancel
        </Button>
      </ActionsContainer>
    </form>
  )
}
