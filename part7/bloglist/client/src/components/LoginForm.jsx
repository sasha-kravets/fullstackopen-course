import { TextField, Typography, Button, Box } from '@mui/material'
import { useNotificationActions, useUserActions } from '../store'
import { useField } from '../hooks'

const LoginForm = ({ navigate }) => {
  const { login } = useUserActions()
  const { showNotification } = useNotificationActions()

  const username = useField('text')
  const password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login({ username: username.value, password: password.value })
      navigate('/')
      showNotification('You have successfully logged in')
      username.onReset()
      password.onReset()
    } catch (error) {
      console.log(error)
      showNotification('Wrong username or password', 'error')
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Log in to application
      </Typography>

      <form onSubmit={handleLogin}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <TextField label="username" {...username} />
          <TextField label="password" {...password} />

          <Button type="submit" variant="contained">
            login
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default LoginForm
