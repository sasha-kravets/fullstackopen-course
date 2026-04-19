import { useAllUsers } from '../store'
import { useMatch } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

const User = () => {
  const users = useAllUsers()

  const match = useMatch('/users/:id')
  const user = match ? users.find((u) => u.id === match.params.id) : null

  if (!user) {
    return null
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        {user.name}
      </Typography>
      <Typography gutterBottom sx={{ fontSize: 18 }}>
        Added blogs:
      </Typography>
      <Box component="ul">
        {user.blogs.map((blog) => (
          <Typography component="li" key={blog.id} sx={{ mt: 0.5 }}>
            {blog.title}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

export default User
