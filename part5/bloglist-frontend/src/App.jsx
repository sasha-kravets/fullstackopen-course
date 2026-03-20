import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: '' })

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

  const blogFormRef = useRef()

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs([...blogs, returnedBlog])
      showNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch (err) {
      console.log(err)
      if (err.response?.status === 400) {
        showNotification('Error: title and url are required', 'error')
      } else {
        showNotification(`Error: ${err}`, 'error')
      }
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
    } catch (err) {
      console.log(err)
      showNotification(`Error: ${err}`, 'error')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(b => b.id !== id))
      showNotification('Blog is successfully removed')
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

      showNotification('You have successfully logged in')
    } catch {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
    showNotification('You have successfully logged out')
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />

        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      {blogForm()}

      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={addLike}
          username={user.username}
          onDelete={deleteBlog}/>
      )}
    </div>
  )
}

export default App