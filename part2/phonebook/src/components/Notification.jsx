const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }

  return (
    <div className={`message-${notification.isError ? 'error' : 'success'}`}  >
      {notification.message}
    </div>
  )
}

export default Notification