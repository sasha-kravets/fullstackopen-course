import { createContext, useReducer, useRef } from 'react'

const notificationReducer = (state, action) => {
  if (action.type === 'SET_NOTIFICATION') {
    return action.payload
  }
  return state
}

const NotificationContext = createContext()

export const NotificationProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, { message: '', type: '' })

  const timerRef = useRef(null)

  const showNotification = (message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } })
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: '', type: '' } })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
