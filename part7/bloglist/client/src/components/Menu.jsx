import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import useUser from '../hooks/useUser'

const btnStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

const Menu = () => {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          Blog App
        </Typography>

        <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} to="/" sx={btnStyle}>
            blogs
          </Button>
          {!user ? (
            <Button color="inherit" component={Link} to="/login" sx={btnStyle}>
              login
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/create" sx={btnStyle}>
                new blog
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={btnStyle}>
                logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Menu
