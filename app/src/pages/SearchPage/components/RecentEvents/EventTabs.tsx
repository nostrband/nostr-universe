import React, { FC } from 'react'
import { StyledTab, StyledTabs } from './styled'

type EventTabsProps = {
  tabItems: {
    label: string
    key: string
  }[]
  onChange: (event: React.SyntheticEvent, newValue: string) => void
  value: string
}

export const EventTabs: FC<EventTabsProps> = ({ tabItems = [], onChange, value }) => {
  return (
    <StyledTabs value={value} onChange={onChange}>
      {tabItems.map((tab) => {
        return <StyledTab key={tab.key} label={tab.label} value={tab.key} />
      })}
    </StyledTabs>
  )
}
