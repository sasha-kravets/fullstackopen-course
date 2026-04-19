import { useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'

import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import ErrorBoundary from './components/ErrorBoundary'
import { useAllUsersActions, useBlogActions, useUserActions } from './store'
import Menu from './components/Menu'
import UserList from './components/UserList'
import User from './components/User'

const App = () => {
  const navigate = useNavigate()

  const { initializeUser } = useUserActions()
  const { initialize } = useBlogActions()
  const { initializeUsers } = useAllUsersActions()

  useEffect(() => {
    initializeUser()
    initialize()
    initializeUsers()
  }, [initializeUser, initialize, initializeUsers])

  return (
    <Container>
      <Menu navigate={navigate} />

      <ErrorBoundary>
        <Notification />
        <Routes>
          <Route path="/blogs/:id" element={<Blog navigate={navigate} />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/" element={<BlogList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/create" element={<BlogForm navigate={navigate} />} />
          <Route path="/login" element={<LoginForm navigate={navigate} />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
