type User = {
  name: string
  isActive: boolean
}

const user: User = {
  name: 'Jhon',
  isActive: true
}

const arr = [user, user, user]

export const App = () => {
  // const isActiveUser: boolean = user.isActive

  const fn = (a: User[]) => {
    return a
  }

  return <>{fn(arr)}</>
}
