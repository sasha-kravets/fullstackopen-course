import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'

import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import ErrorBoundary from './components/ErrorBoundary'
import useUser from './hooks/useUser'
import Menu from './components/Menu'
import UserList from './components/UserList'
import User from './components/User'

const App = () => {
  const { initializeUser } = useUser()

  useEffect(() => {
    initializeUser()
  }, [])

  return (
    <Container>
      <Menu />

      <ErrorBoundary>
        <Notification />

        <Routes>
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/" element={<BlogList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
