import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog /> component', () => {
  let mockAddLike
  let mockDeleteBlog

  mockAddLike = vi.fn()
  mockDeleteBlog = vi.fn()

  const creator = {
    username: 'skravets',
    name: 'Sasha Kravets',
    id: '69b0a6a43a45c3e4564d4aed',
  }

  const user = {
    uername: 'doe',
    name: 'Dillan Doe',
    id: 'a6a43a45c',
  }

  const blog = {
    url: 'http://example.com',
    title: 'Using token based auth',
    author: 'Sasha Kravets',
    user: creator,
    likes: 125,
    id: '69b327f7135dac9cfae40713',
  }

  test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {
    render(
      <Blog
        blog={blog}
        user={null}
        addLike={mockAddLike}
        deleteBlog={mockDeleteBlog}
      />,
    )

    expect(screen.getByText('Using token based auth')).toBeVisible()
    expect(screen.getByText('Added by Sasha Kravets')).toBeVisible()
    expect(screen.getByText('likes 125')).toBeVisible()
    expect(screen.getByText('http://example.com')).toBeVisible()

    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('Authenticated users who are not the blog\'s creator are shown only the like button', () => {
    render(
      <Blog
        blog={blog}
        user={user}
        addLike={mockAddLike}
        deleteBlog={mockDeleteBlog}
      />,
    )

    expect(screen.queryByText('like')).toBeDefined()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('Both buttons are displayed to users who are logged in and are blog authors', () => {
    render(
      <Blog
        blog={blog}
        user={creator}
        addLike={mockAddLike}
        deleteBlog={mockDeleteBlog}
      />,
    )

    expect(screen.queryByText('like')).toBeDefined()
    expect(screen.queryByText('remove')).toBeDefined()
  })
})
