import { useState } from "react"

const Blog = ({ blog, updateLikes, username, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const {id, title, url, likes, author, user} = blog

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
    <div style={blogStyle}>
      <div>
        {title} <button onClick={toggleDetails}>{isExpanded ? 'hide' : 'view'}</button>
      </div>

      <div style={detailsStyle}>
        <div>{url}</div>
        <div>likes {likes} <button onClick={addLike}>like</button></div>
        <div>{author}</div>
        <button
          style={removeBtnStyle}
          onClick={deleteBlog}
        >
          remove
        </button>
      </div>
    </div>
  )
}

export default Blog