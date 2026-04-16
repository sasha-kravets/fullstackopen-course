import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: '' })

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
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
      showNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
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
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
    } catch (err) {
      if (err.response?.status === 401) {
        showNotification('Error: Only logged-in users can "Like" a blog', 'error')
      } else {
        console.log(err)
        showNotification(`Error: ${err}`, 'error')
      }
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
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

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
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

  return (
    <div>
      <nav>
        <Link to="/">blogs</Link>
        {!user
          ? <Link to="/login">login</Link>
          : <>
            <Link to="/create">new blog</Link>
            <button onClick={handleLogout}>logout</button>
          </>
        }
      </nav>

      <Notification notification={notification} />

      <Routes>
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            addLike={addLike}
            deleteBlog={deleteBlog}
            user={user}
          />
        } />
        <Route path='/' element={<BlogList blogs={blogs} />} />
        <Route path='/create' element={<BlogForm createBlog={createBlog} />} />
        <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
      </Routes>

    </div>
  )
}

export default App