import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [user])

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

  const addBlog = async event => {
    event.preventDefault()

    try {
      const blogObject = {
        title: title,
        author: author || 'unknown',
        url: url,
      }

      const returnedBlog = await blogService.create(blogObject)
      setBlogs([...blogs, returnedBlog])
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch (err) {
      console.log(err)
      if (err.response?.status === 400) {
        showNotification(`Error: title and url are required`, 'error')
      } else {
        showNotification(`Error: ${err}`, 'error')
      }
    }
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}  
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}  
              />
            </label>
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
            <label>
              title:
              <input
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}  
              />
            </label>
          </div>
        <div>
            <label>
              author:
              <input
                type="text"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}  
              />
            </label>
          </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}  
            />
          </label>
        </div>
        <button>create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App