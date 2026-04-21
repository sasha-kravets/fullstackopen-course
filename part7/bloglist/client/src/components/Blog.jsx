import {
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import useUser from '../hooks/useUser'
import { useMatch, useNavigate } from 'react-router-dom'
import { useField } from '../hooks/useField'
import useNotification from '../hooks/useNotification'

const Blog = () => {
  const navigate = useNavigate()
  const { blogs, like, deleteBlog, addComment } = useBlogs()
  const { user, logout } = useUser()
  const { showNotification } = useNotification()

  const comment = useField('text')

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  if (!blog) return null

  const canBeRemoved = () => user && user.username === blog.user.username

  const handleLike = async () => {
    try {
      await like(blog)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        logout()
        showNotification('Error: Only logged-in users can "Like" a blog', 'error')
      } else {
        showNotification(`Error: ${err.message || err}`, 'error')
      }
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Remove blog ${blog.title} by ${blog.author}`)) return

    try {
      await deleteBlog(blog.id)
      showNotification('Blog is successfully deleted')
      navigate('/')
    } catch (err) {
      console.error(err)
      showNotification(`Error: ${err.message || err}`, 'error')
    }
  }

  const { onReset, ...commentProps } = comment

  const handleComment = async (event) => {
    event.preventDefault()

    try {
      await addComment({
        id: blog.id,
        comment: comment.value,
      })
      comment.onReset()
      showNotification('Comment is successfully added')
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        logout()
        showNotification('Error: Only logged-in users can comment a blog', 'error')
      } else {
        showNotification(`Error: ${err.message || err}`, 'error')
      }
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

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom sx={{ fontSize: 18 }}>
            comments
          </Typography>

          {user && (
            <Box component="form" onSubmit={handleComment} sx={{ display: 'flex', gap: 1 }}>
              <TextField label="add a comment" {...commentProps} />

              <Button type="submit" variant="contained">
                add comment
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            {blog.comments && blog.comments.length > 0 ? (
              <Box component="ul">
                {blog.comments.map((c) => (
                  <Typography component="li" key={c.id} sx={{ mt: 0.5 }}>
                    {c.comment}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography>No comments yet</Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog
