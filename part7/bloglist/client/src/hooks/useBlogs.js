import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import useUser from './useUser'

export const useBlogs = () => {
  const queryClient = useQueryClient()
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
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
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
    },
  })

  const commentBlogMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.comment(id, comment),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs']) || []

      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )
    },
  })

  return {
    blogs: result.data,
    isPending: result.isPending,
    addBlog: newBlogMutation.mutateAsync,
    addComment: commentBlogMutation.mutateAsync,
    // like: updateBlogMutation.mutateAsync,
    like: (blog) =>
      updateBlogMutation.mutateAsync({
        id: blog.id,
        blog: {
          ...blog,
          likes: blog.likes + 1,
          user: blog.user.id,
        },
      }),
    deleteBlog: deleteBlogMutation.mutateAsync,
  }
}
