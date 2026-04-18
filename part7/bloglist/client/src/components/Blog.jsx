import {
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Typography,
} from '@mui/material'

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
    <Card sx={{ mt: 1 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          {blog.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1, mb: 0.5 }}>
          by {blog.author}
        </Typography>
        <MuiLink href={blog.url}>{blog.url}</MuiLink>
        <Typography sx={{ color: 'text.secondary', mt: 1, mb: 0.5 }}>
          Added by {blog.user.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Typography sx={{ fontWeight: 500 }}>{blog.likes} likes</Typography>

          {user && (
            <Button variant="outlined" onClick={() => addLike(blog)}>
              like
            </Button>
          )}

          {canBeRemoved() && (
            <Button variant="outlined" color="error" onClick={handleDelete}>
              remove
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog