import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm /> component', () => {
  test('the form calls the event handler with the right details when a new blog is created', async () => {
    const mockAddBlog = vi.fn()

    render(<BlogForm createBlog={mockAddBlog} />)

    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Blog Author')
    await user.type(urlInput, 'https://example.com/test')

    const createButton = screen.getByText('create')
    await user.click(createButton)

    expect(mockAddBlog.mock.calls).toHaveLength(1)
    expect(mockAddBlog.mock.calls[0][0]).toEqual({
      title: 'Test Blog Title',
      author: 'Test Blog Author',
      url: 'https://example.com/test',
    })
  })
})
