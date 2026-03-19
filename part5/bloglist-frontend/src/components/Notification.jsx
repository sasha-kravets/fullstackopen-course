const Notification = ({ notification }) => {
  const { message, type } = notification

  if (!message) return null

  return (
    <div className={`notification ${type}`}  >
      {message}
    </div>
  )
}

export default Notification