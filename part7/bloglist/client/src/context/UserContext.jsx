import { createContext, useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import useNotification from '../hooks/useNotification'
import persistentUserService from '../services/persistentUser'

const UserContext = createContext()

export default UserContext

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null)
  const { showNotification } = useNotification()

  const initializeUser = () => {
    const user  = persistentUserService.getUser()
    if (user) {
      setUser(user)
      blogService.setToken(user.token)
    }
  }

  const login = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      persistentUserService.saveUser(user)
      blogService.setToken(user.token)
      setUser(user)
      showNotification('You have successfully logged in')
    } catch {
      showNotification('Wrong username or password', 'error')
    }
  }

  const logout = () => {
    setUser(null)
    persistentUserService.removeUser()
    showNotification('You have successfully logged out')
  }

  return (
    <UserContext.Provider value={{ user, initializeUser, login, logout }}>
      {props.children}
    </UserContext.Provider>
  )
}
