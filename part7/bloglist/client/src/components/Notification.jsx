import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  const { message, type } = notification

  if (!message) return null

  return (
    <Alert style={{ mt: 1, mb: 1 }} severity={type}>
      {message}
    </Alert>
  )
}

export default Notification
