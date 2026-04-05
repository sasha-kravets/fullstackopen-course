import { vote } from '../reducers/anecdoteReducer'
import { useDispatch, useSelector } from 'react-redux'

const Anecdote = ({ content, votes, handleClick }) => {
  return (
    <div>
      <div>{content}</div>
      <div>
        has {votes}
        <button onClick={handleClick}>vote</button>
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

  return (
    <div>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          content={anecdote.content}
          votes={anecdote.votes}
          handleClick={() => dispatch(vote(anecdote.id))}
        />
      ))}
    </div>
  )
}

export default AnecdoteList