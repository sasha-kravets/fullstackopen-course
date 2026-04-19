import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'
import persistentUserService from './services/persistentUser'
import userService from './services/users'

// All Users Store
const useAllUsersStore = create((set) => ({
  users: [],
  actions: {
    initializeUsers: async () => {
      const users = await userService.getAll()
      set(() => ({ users }))
    },
  },
}))

export const useAllUsers = () => useAllUsersStore((state) => state.users)
export const useAllUsersActions = () => useAllUsersStore((state) => state.actions)

// Single User Store
const useUserStore = create((set) => ({
  user: null,
  actions: {
    initializeUser: async () => {
      const loggedUserJSON = persistentUserService.getUser()
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        set(() => ({ user }))
        blogService.setToken(user.token)
      }
    },
    login: async (userObject) => {
      const user = await loginService.login(userObject)
      persistentUserService.saveUser(user)
      set(() => ({ user }))
      blogService.setToken(user.token)
    },
    logout: () => {
      set(() => ({ user: null }))
      persistentUserService.removeUser()
    },
  },
}))

export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)

// Blog Store
const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    add: async (blogObject) => {
      const newBlog = await blogService.create(blogObject)
      set((state) => ({ blogs: [...state.blogs, newBlog] }))
    },
    like: async (id) => {
      const blog = get().blogs.find((b) => b.id === id)
      const updated = await blogService.update(id, { likes: blog.likes + 1 })
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? updated : b)),
      }))
    },
    deleteBlog: async (id) => {
      await blogService.deleteBlog(id)
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== id),
      }))
    },
    addComment: async (id, comment) => {
      const updated = await blogService.comment(id, comment)
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? updated : b)),
      }))
    },

    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },
  },
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)

// Notification Store
const useNotificationStore = create((set) => ({
  notification: { message: '', type: '' },
  actions: {
    showNotification: (message, type = 'success') => {
      set({ notification: { message, type } })

      setTimeout(() => {
        set({ notification: { message: '', type: '' } })
      }, 5000)
    },
  },
}))

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
