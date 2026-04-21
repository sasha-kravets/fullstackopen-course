import { useState } from 'react'
import { TextField, Typography, Button, Box } from '@mui/material'
import useUser from '../hooks/useUser'
import { useField } from '../hooks/useField'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useUser()

  const username = useField('text')
  const password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login({ username: username.value, password: password.value })
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      username.onReset()
      password.onReset()
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
