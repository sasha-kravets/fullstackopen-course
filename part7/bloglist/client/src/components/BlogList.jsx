import { Link } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs'
import { Box, Typography } from '@mui/material'

const BlogList = () => {
  const { blogs, isPending } = useBlogs()

  if (isPending) {
    return <div>loading data...</div>
  }

  if (!blogs) return null

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Blogs
      </Typography>

      <Box component="ul">
        {sortedBlogs.map((blog) => (
          <Typography component="li" key={blog.id} sx={{ mt: 0.5 }}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

export default BlogList
