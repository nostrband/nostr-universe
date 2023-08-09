type User = {
  name: string
  isActive: boolean
}

const user: User = {
  name: 'Jhon',
  isActive: true
}

export const App = () => {
  const isActiveUser: boolean = user.isActive

  return <>{isActiveUser && user.name}</>
}
