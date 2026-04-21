import { Link } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs'

const BlogList = () => {
  const { blogs, isPending } = useBlogs()

  if (isPending) {
    return <div>loading data...</div>
  }

  if (!blogs) return null

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
