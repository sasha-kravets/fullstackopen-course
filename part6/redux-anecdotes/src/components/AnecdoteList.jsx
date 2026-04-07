import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'

const Anecdote = ({ content, votes, onVote }) => {
  return (
    <div>
      <div>{content}</div>
      <div>
        has {votes}
        <button onClick={onVote}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    const sortedAnecdotes = [...state.anecdotes].sort((a, b) => b.votes - a.votes)

    if (state.filter === 'ALL') {
      return sortedAnecdotes
    }
    return sortedAnecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  })

  const handleVote = (anecdote) => {
    dispatch(addVote(anecdote.id))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
  }

  return (
    <div>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          content={anecdote.content}
          votes={anecdote.votes}
          onVote={() => handleVote(anecdote)}
        />
      ))}
    </div>
  )
}

export default AnecdoteList