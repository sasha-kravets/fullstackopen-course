import { useState } from 'react'
import { TextField, Typography, Button, Box } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author || 'unknown',
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Log in to application
      </Typography>

      <form onSubmit={addBlog}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <TextField
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            sx={{ width: '100%', maxWidth: 600 }}
          />
          <TextField
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            sx={{ width: '100%', maxWidth: 600 }}
          />
          <TextField
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            sx={{ width: '100%', maxWidth: 600 }}
          />

          <Button type="submit" variant="contained">
            create
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default BlogForm
