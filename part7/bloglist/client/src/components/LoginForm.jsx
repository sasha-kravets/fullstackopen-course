import { useState } from 'react'
import { TextField, Typography, Button, Box } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    onLogin({ username, password })
    setUsername('')
    setPassword('')
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
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          <Button type="submit" variant="contained">
            login
          </Button>
        </Box>
      </form>
    </Box>
    // <div>
    //   <h2>Log in to application</h2>

  //   <form onSubmit={handleLogin}>
  //     <div>
  //       <TextField
  //         label="username"
  //         value={username}
  //         onChange={({ target }) => setUsername(target.value)}
  //       />
  //     </div>
  //     <div>
  //       <TextField
  //         label="password"
  //         type="password"
  //         value={password}
  //         onChange={({ target }) => setPassword(target.value)}
  //         style={{ marginTop: 10 }}
  //       />
  //     </div>

  //     <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
  //       login
  //     </Button>
  //   </form>
  // </div>
  )
}

export default LoginForm
