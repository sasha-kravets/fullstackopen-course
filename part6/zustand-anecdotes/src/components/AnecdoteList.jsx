import { useAnecdotes, useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { showNotification } = useNotificationActions()
  const { vote, deleteAnecdote } = useAnecdoteActions()

  const handleVote = (anecdote) => {
    vote(anecdote.id)
    showNotification(`you voted '${anecdote.content}'`)
  }

  const handleDelete = (anecdote) => {
    if (anecdote.votes > 0) return
    if (confirm(`Delete '${anecdote.content}'?`)) {
      deleteAnecdote(anecdote.id)
      showNotification(`you deleted '${anecdote.content}'`)
    }
  }

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            <button
              disabled={anecdote.votes > 0}         
              onClick={() => handleDelete(anecdote)}
            >
              delete
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList