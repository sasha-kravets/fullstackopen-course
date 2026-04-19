import {
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material'
import { useBlogActions, useBlogs, useNotificationActions, useUser } from '../store'
import { useMatch } from 'react-router-dom'
import { useField } from '../hooks'

const Blog = ({ navigate }) => {
  const blogs = useBlogs()
  const { like, deleteBlog, addComment } = useBlogActions()
  const user = useUser()
  const { showNotification } = useNotificationActions()
  const comment = useField('text')

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  if (!blog) {
    return null
  }

  const handleLike = async (id) => {
    try {
      await like(id)
    } catch (err) {
      if (err.response?.status === 401) {
        showNotification('Error: Only logged-in users can "Like" a blog', 'error')
      } else {
        console.log(err)
        showNotification(`Error: ${err}`, 'error')
      }
    }
  }

  const canBeRemoved = () => user && user.username === blog.user.username

  const handleDelete = async () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await deleteBlog(blog.id)
        showNotification('Blog is successfully removed')
        navigate('/')
      } catch (err) {
        console.log(err)
        showNotification(`Error: ${err}`, 'error')
      }
    }
  }

  const handleComment = async (event) => {
    event.preventDefault()
    try {
      await addComment(blog.id, comment.value)
      comment.onReset()
      showNotification('Comment is successfully added')
    } catch (err) {
      console.log(err)
      showNotification(`Error: ${err}`, 'error')
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
            <Button variant="outlined" onClick={() => handleLike(blog.id)}>
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
              <TextField label="add a comment" {...comment} />

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
