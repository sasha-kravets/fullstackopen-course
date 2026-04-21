const getUser = () => {
  const json = window.localStorage.getItem('loggedBloglistUser')
  return json ? JSON.parse(json) : null
}

const saveUser = (user) => {
  window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem('loggedBloglistUser')
}

export default { getUser, saveUser, removeUser }
