import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog /> component', () => {
  let mockAddLike
  let mockDeleteBlog

  const blog = {
    url: 'http://example.com',
    title: 'Using token based auth',
    author: 'Sasha Kravets',
    user: {
      username: 'skravets',
      name: 'Sasha Kravets',
      id: '69b0a6a43a45c3e4564d4aed'
    },
    likes: 125,
    id: '69b327f7135dac9cfae40713'
  }

  beforeEach(() => {
    mockAddLike = vi.fn()
    mockDeleteBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        updateLikes={mockAddLike}
        username={'skravets'}
        onDelete={mockDeleteBlog}
      />
    )
  })

  test('renders the blog\'s title and author, but does not render its URL or number of likes by default', () => {
    expect(screen.getByText('Using token based auth')).toBeVisible()
    expect(screen.getByText('Sasha Kravets')).toBeVisible()

    expect(screen.queryByText('http://example.com')).not.toBeVisible()
    expect(screen.queryByText('likes 125')).not.toBeVisible()
  })

  test('blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.queryByText('http://example.com')).toBeVisible()
    expect(screen.queryByText('likes 125')).toBeVisible()
  })

  test('when like button is clicked twice, the event handler called twice', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockAddLike.mock.calls).toHaveLength(2)
  })
})