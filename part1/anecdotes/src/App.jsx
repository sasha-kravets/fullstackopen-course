import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  let anecdotesLength = anecdotes.length

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
  }

  const [selected, setSelected] = useState(getRandomInt(anecdotesLength))
  const [votes, setVotes] = useState(Array(anecdotesLength).fill(0))

  const getMaxVotes = () => Math.max(...votes)
  const getTopIndex = () => votes.findIndex(v => v === getMaxVotes())

  const handleSelectedClick = () => {
    let newSelected = getRandomInt(anecdotesLength)
    while (newSelected === selected) {
      newSelected = getRandomInt(anecdotesLength)
    }
    setSelected(newSelected)
  }

  const handleVotesClick = () =>  {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <div>
        <Button onClick={handleVotesClick} text={'vote'} />
        <Button onClick={handleSelectedClick} text={'next anecdote'} />
      </div>

      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[getTopIndex()]}</p>
      <p>has {getMaxVotes()} votes</p>
    </div>
  )
}

export default App