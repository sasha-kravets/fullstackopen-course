import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: '', delay: 0 }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return initialState
    }
  }
})

const { showNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, delay) => {
  return (dispatch) => {
    dispatch(showNotification({ message, delay }))

    setTimeout(() => {
      dispatch(clearNotification())
    }, delay * 1000)
  }
}

export default notificationSlice.reducer