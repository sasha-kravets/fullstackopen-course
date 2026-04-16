const Blog = ({ blog, user, addLike, deleteBlog }) => {

  if (!blog) {
    return null
  }

  const canBeRemoved = () => user && user.username === blog.user.username

  const handleDelete = () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div className='blog'>
      <h2 className="blog__title">{blog.title}</h2>
      <div className="blog__details">
        <a href={blog.url} className="blog__url">{blog.url}</a>
        <div className="blog__likes">
          <span>likes {blog.likes}</span>{' '}
          {user && (
            <button
              className="blog__like-btn"
              onClick={() => addLike(blog)}
            >
              like
            </button>
          )}
        </div>
        <div>{`Added by ${blog.author}`}</div>
        {canBeRemoved() && (
          <button
            className="blog__remove-btn"
            onClick={handleDelete}
          >
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog