import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'

import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: '' })

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, 4000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [notification])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs([...blogs, returnedBlog])
      showNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
      )
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

  const addLike = async (blog) => {
    const newBlog = { ...blog, user: blog.user.id, likes: blog.likes + 1 }
    try {
      const returnedBlog = await blogService.update(newBlog)
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)))
    } catch (err) {
      if (err.response?.status === 401) {
        showNotification(
          'Error: Only logged-in users can "Like" a blog',
          'error',
        )
      } else {
        console.log(err)
        showNotification(`Error: ${err}`, 'error')
      }
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      showNotification('Blog is successfully removed')
      navigate('/')
    } catch (err) {
      console.log(err)
      showNotification(`Error: ${err}`, 'error')
    }
  }

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      navigate('/')
      showNotification('You have successfully logged in')
    } catch {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
    navigate('/')
    showNotification('You have successfully logged out')
  }

  const btnStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
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
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={btnStyle}
              >
                login
              </Button>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/create"
                  sx={btnStyle}
                >
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

      <ErrorBoundary>
        <Notification notification={notification} />

        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                addLike={addLike}
                deleteBlog={deleteBlog}
                user={user}
              />
            }
          />
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route
            path="/create"
            element={<BlogForm createBlog={createBlog} />}
          />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
