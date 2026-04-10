import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    vote: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const anecdotes = [{ id: 1, content: 'If it hurts, do it more often', votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(anecdotes)
  })

  it('anecdotes received from the store are sorted by votes', async () => {
    const anecdotes = [
      { id: 1, content: 'If it hurts, do it more often', votes: 0 },
      { id: 2, content: 'Adding manpower to a late software project makes it later!', votes: 4 },
      { id: 3, content: 'Premature optimization is the root of all evil.', votes: 1 },
    ]
    useAnecdoteStore.setState({ anecdotes })

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current[0].id).toEqual(2)
    expect(result.current[1].id).toEqual(3)
    expect(result.current[2].id).toEqual(1)
  })

  it('voting increases the number of votes for an anecdote', async () => {
    const anecdote = { id: 1, content: 'If it hurts, do it more often', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.vote.mockResolvedValue({ ...anecdote, votes: 1 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote(1)
    })

    const { result: anecdoteResult } = renderHook(() => useAnecdotes())
    expect(anecdoteResult.current[0].votes).toBe(1)
  })
})

describe('filtering', () => {
  const anecdotes = [
    { id: 1, content: 'If it hurts, do it more often', votes: 0 },
    { id: 2, content: 'Adding manpower to a late software project makes it later!', votes: 1 },
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes })
  })

  it('returns all anecdotes with no filter', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(2)
  })

  it('component receives a properly filtered list of anecdotes', async () => {
    useAnecdoteStore.setState({ filter: 'Add' })

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(1)
    expect(result.current).toEqual([anecdotes[1]])
  })
  
  it('component receives a properly filtered list of anecdotes (no found)', async () => {
    useAnecdoteStore.setState({ filter: 'fullstackopen' })

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(0)
  })
})