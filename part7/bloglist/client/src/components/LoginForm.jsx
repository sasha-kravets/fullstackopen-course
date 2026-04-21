import { useState } from 'react'
import { TextField, Typography, Button, Box } from '@mui/material'
import useUser from '../hooks/useUser'
import { useField } from '../hooks/useField'
import { useNavigate } from 'react-router-dom'
import useNotification from '../hooks/useNotification'

const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useUser()
  const { showNotification } = useNotification()

  const username = useField('text')
  const password = useField('password')

  const { onReset: resetUsername, ...usernameProps } = username
  const { onReset: resetPassword, ...passwordProps } = password

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login({ username: usernameProps.value, password: passwordProps.value })
      navigate('/')
      showNotification('You have successfully logged in')
    } catch (err) {
      console.error(err)
      showNotification('Wrong username or password', 'error')
    } finally {
      resetUsername()
      resetPassword()
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
