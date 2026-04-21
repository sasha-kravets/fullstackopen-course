import { useState } from 'react'
import { TextField, Typography, Button, Box } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import { useField } from '../hooks/useField'
import { useNavigate } from 'react-router-dom'

const BlogForm = () => {
  const navigate = useNavigate()
  const { addBlog } = useBlogs(navigate)

  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleSubmit = async () => {
    event.preventDefault()

    const blogObject = {
      title: title.value,
      author: author.value || 'unknown',
      url: url.value,
    }

    try {
      await addBlog(blogObject)
      navigate('/')
    } catch (err) {
      console.error(err)
    }

    title.onReset()
    author.onReset()
    url.onReset()
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create new Blog
      </Typography>

      <form onSubmit={handleSubmit}>
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
