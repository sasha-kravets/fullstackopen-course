import { TextField, Typography, Button, Box } from '@mui/material'
import { useBlogActions, useNotificationActions } from '../store'
import { useField } from '../hooks'

const BlogForm = ({ navigate }) => {
  const { add } = useBlogActions()
  const { showNotification } = useNotificationActions()

  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const createBlog = async (event) => {
    const blog = {
      title: title.value,
      author: author.value || 'unknown',
      url: url.value,
    }
    event.preventDefault()
    try {
      await add(blog)
      showNotification(`a new blog ${blog.title} by ${blog.author} added`)
      title.onReset()
      author.onReset()
      url.onReset()
      navigate('/')
    } catch (err) {
      console.log(err)
      if (err.response?.status === 400) {
        showNotification('Error: title and url are required', 'error')
      } else {
        showNotification(`Error: ${err}`, 'error')
      }
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create new Blog
      </Typography>

      <form onSubmit={createBlog}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <TextField label="title" sx={{ width: '100%', maxWidth: 600 }} {...title} />
          <TextField label="author" sx={{ width: '100%', maxWidth: 600 }} {...author} />
          <TextField label="url" sx={{ width: '100%', maxWidth: 600 }} {...url} />

          <Button type="submit" variant="contained">
            create
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default BlogForm
