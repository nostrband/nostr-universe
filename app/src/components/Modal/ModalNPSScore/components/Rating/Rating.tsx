import { FC } from 'react'
import { StyledToggleButton, StyledToggleButtonGroup } from './styled'
import { RATE_VALUES } from './consts'
import { RatingProps } from './types'

export const Rating: FC<RatingProps<number>> = ({ selectedRating, onRateChange }) => {
  return (
    <StyledToggleButtonGroup value={selectedRating} exclusive onChange={onRateChange}>
      {RATE_VALUES.map((rateIndex) => {
        return (
          <StyledToggleButton key={rateIndex} value={rateIndex}>
            {rateIndex}
          </StyledToggleButton>
        )
      })}
    </StyledToggleButtonGroup>
  )
}
