import { Alert } from '@mui/material'
import useNotification from '../hooks/useNotification'

const Notification = () => {
  const { notification } = useNotification()

  if (!notification.message) return null

  return (
    <Alert sx={{ mt: 2, mb: 1 }} severity={notification.type}>
      {notification.message}
    </Alert>
  )
}

export default Notification
