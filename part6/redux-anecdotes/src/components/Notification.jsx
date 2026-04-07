import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { removeNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const dispatch = useDispatch()
  const message = useSelector(state => state.notification)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [dispatch, message])

  if (!message) return null

  return <div style={style}>
    {message}
  </div>
}

export default Notification