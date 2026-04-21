import { Box, Button, Card, CardContent, Link as MuiLink, Typography } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import useUser from '../hooks/useUser'
import { useMatch, useNavigate } from 'react-router-dom'

const Blog = () => {
  const navigate = useNavigate()
  const { blogs, like, deleteBlog } = useBlogs()
  const { user } = useUser()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  if (!blog) return null

  const canBeRemoved = () => user && user.username === blog.user.username

  const handleLike = async () => {
    try {
      await like(blog)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Remove blog ${blog.title} by ${blog.author}`)) return

    try {
      await deleteBlog(blog.id)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card sx={{ mt: 1 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          {blog.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1, mb: 0.5 }}>by {blog.author}</Typography>
        <MuiLink href={blog.url}>{blog.url}</MuiLink>
        <Typography sx={{ color: 'text.secondary', mt: 1, mb: 0.5 }}>
          Added by {blog.user.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Typography sx={{ fontWeight: 500 }}>{blog.likes} likes</Typography>

          {user && (
            <Button variant="outlined" onClick={handleLike}>
              like
            </Button>
          )}

          {canBeRemoved() && (
            <Button variant="outlined" color="error" onClick={handleDelete}>
              remove
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog
