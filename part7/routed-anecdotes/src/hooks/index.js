import { useEffect, useState } from "react"
import anecdoteService from "../services/anecdotes"

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onReset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    onReset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
  setAnecdotes(prev => [...prev, newAnecdote])
  }

  const deleteAnecdote = async (anecdote) => {
    if (confirm(`Delete ${anecdote.content}?`)) {
      await anecdoteService.deleteAnecdote(anecdote.id)
      setAnecdotes(prev => prev.filter(a => a.id !== anecdote.id))
    }
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}