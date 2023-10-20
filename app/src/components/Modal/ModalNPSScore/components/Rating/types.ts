export type RatingProps<T> = {
  selectedRating: number | undefined
  onRateChange: (event: React.MouseEvent<HTMLElement, MouseEvent>, value: T) => void
}
