import { useState } from 'react'
import { TextField, Typography, Button, Box } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import { useField } from '../hooks/useField'
import { useNavigate } from 'react-router-dom'
import useNotification from '../hooks/useNotification'
import useUser from '../hooks/useUser'

const BlogForm = () => {
  const navigate = useNavigate()
  const { addBlog } = useBlogs()
  const { logout } = useUser()
  const { showNotification } = useNotification()

  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const { onReset: resetTitle, ...titleProps } = title
  const { onReset: resetAuthor, ...authorProps } = author
  const { onReset: resetUrl, ...urlProps } = url

  const handleSubmit = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: titleProps.value,
      author: authorProps.value || 'unknown',
      url: urlProps.value,
    }

    try {
      await addBlog(blogObject)
      resetTitle()
      resetAuthor()
      resetUrl()
      navigate('/')
      showNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        logout()
        showNotification('You must be logged in to add a blog', 'error')
      } else if (err.response?.status === 400) {
        showNotification('Error: title and url are required', 'error')
      } else {
        showNotification(`Error: ${err.message || err}`, 'error')
      }
    }
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
