import { useState } from 'react'

const Blog = ({ blog, updateLikes, username, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const { id, title, url, likes, author, user } = blog

  const toggleDetails = () => {
    setIsExpanded(!isExpanded)
  }

  const detailsStyle = { display: isExpanded ? '' : 'none' }
  const removeBtnStyle = { display: username === user.username ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    updateLikes(id, {
      user: user.id,
      likes: likes + 1,
      author,
      title,
      url
    })
  }

  const deleteBlog = () => {
    if (confirm(`Remove blog ${title} by ${author}`)) {
      onDelete(id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className="blog__header">
        <span className="blog__title">{title}</span>{' '}
        <span className="blog__author">{author}</span>{' '}
        <button
          className="blog__toggle-btn"
          onClick={toggleDetails}
        >
          {isExpanded ? 'hide' : 'view'}
        </button>
      </div>

      <div style={detailsStyle} className="blog__details">
        <div className="blog__url">{url}</div>
        <div className="blog__likes">
          <span>likes {likes}</span>{' '}
          <button
            className="blog__like-btn"
            onClick={addLike}
          >
            like
          </button>
        </div>
        <button
          style={removeBtnStyle}
          className="blog__remove-btn"
          onClick={deleteBlog}
        >
          remove
        </button>
      </div>
    </div>
  )
}

export default Blog