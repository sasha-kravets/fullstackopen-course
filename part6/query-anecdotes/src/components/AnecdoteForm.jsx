import { useAnecdotes } from '../hooks/useAnecdotes'
import useNotification from '../hooks/useNotify'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdotes()
  const { showNotification } = useNotification()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    createAnecdote(content,
      () => { showNotification('too short anecdote, must have length 5 or more') },
      () => { showNotification(`You created '${content}'`) }
    )
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm