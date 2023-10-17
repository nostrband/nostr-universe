import { Button, Stack } from '@mui/material'
import { Rating } from '../Rating/Rating'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { ActionsContainer, FieldWrapper, StyledLabel, StyledTextarea, SwitchControl } from './styled'
import { FC, FormEvent, useState } from 'react'
import { isGuest } from '@/utils/helpers/prepare-data'
import { useAppSelector } from '@/store/hooks/redux'
import { selectKeys } from '@/store/store'
import { ANSWER_FIELDS, NPSScoreFormProps } from './types'
import { ANONYM, getUsername } from './const'

export const NPSScoreForm: FC<NPSScoreFormProps> = ({ onSubmit }) => {
  const { handleClose } = useOpenModalSearchParams()
  const { keys } = useAppSelector(selectKeys)

  const { currentProfile } = useAppSelector((state) => state.profile)

  const [senderType, setSenderType] = useState<typeof ANONYM | string>(ANONYM)

  const username = getUsername(currentProfile)
  const guest = !keys.length || isGuest(keys[0]) || !username

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
    if (checked && username) {
      return setSenderType(username)
    }
    return setSenderType(ANONYM)
  }

  const isFormValid = Boolean(selectedRating || selectedRating === 0)

  return (
    <form onSubmit={handleSubmit}>
      <FieldWrapper>
        <StyledLabel required>
          On a scale 0-10, how likely are you recommend Spring to a friend or colleague?
        </StyledLabel>
        <Rating selectedRating={selectedRating} onRateChange={ratingChangeHandler} />
      </FieldWrapper>

      <FieldWrapper>
        <StyledLabel htmlFor="reason">What is the primary reason for the score you gave us?</StyledLabel>
        <StyledTextarea id="reason" onChange={answersChangeHandler(ANSWER_FIELDS.PRIMARY_REASON)} />
      </FieldWrapper>

      <FieldWrapper>
        <StyledLabel htmlFor="improvement">
          Is there anything specific that Spring can do to improve your experience?
        </StyledLabel>
        <StyledTextarea id="improvement" onChange={answersChangeHandler(ANSWER_FIELDS.EXPERIENCE_IMPROVEMENT)} />
      </FieldWrapper>

      <Stack direction="row" component="label" alignItems="center">
        <StyledLabel spacing={false}>Send anonymously</StyledLabel>
        <SwitchControl checked={senderType !== ANONYM} onChange={handleSenderTypeChange} />
        {username && !guest && <StyledLabel spacing={false}>Send as «{username}»</StyledLabel>}
      </Stack>

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
