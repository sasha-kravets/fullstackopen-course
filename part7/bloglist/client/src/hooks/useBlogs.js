import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import useNotification from './useNotification'
import useUser from './useUser'

export const useBlogs = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  const { logout } = useUser()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      // queryClient.invalidateQueries({ queryKey: ['blogs'] })
      const blogs = queryClient.getQueryData(['blogs']) || []
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    },
    onError: (err) => {
      if (err.response?.status === 401) {
        logout()
        showNotification('You must be logged in to add a blog', 'error')
      } else if (err.response?.status === 400) {
        showNotification('Error: title and url are required', 'error')
      } else {
        showNotification(`Error: ${err.message || err}`, 'error')
      }
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['blogs'] })
    // }
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs']) || []
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )
    },
    onError: (err) => {
      if (err.response?.status === 401) {
        showNotification('Error: Only logged-in users can "Like" a blog', 'error')
      } else {
        showNotification(`Error: ${err.message || err}`, 'error')
      }
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['blogs'] })
    // }
    onSuccess: (_, id) => {
      const blogs = queryClient.getQueryData(['blogs']) || []
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== id)
      )
      showNotification('Blog is successfully removed')
    },
    onError: (err) => {
      console.log(err)
      showNotification(`Error: ${err.message || err}`, 'error')
    },
  })

  return {
    blogs: result.data,
    isPending: result.isPending,
    addBlog: newBlogMutation.mutateAsync,
    like: (blog) =>
      updateBlogMutation.mutateAsync({
        id: blog.id,
        user: blog.user.id,
        likes: blog.likes + 1,
      }),
    deleteBlog: deleteBlogMutation.mutateAsync,
  }
}
