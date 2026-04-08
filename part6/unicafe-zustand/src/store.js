import { create } from 'zustand'

const useUnicafeStore = create(set => ({
  counter: {
    good: 0,
    neutral: 0,
    bad: 0
  },
  actions: {
    goodClick: () => set(state => ({
      counter: {
        ...state.counter,
        good: state.counter.good + 1
      }
    })),
    neutralClick: () => set(state => ({
        counter: {
          ...state.counter,
          neutral: state.counter.neutral + 1
        }
    })),
    badClick: () => set(state => ({
      counter: {
        ...state.counter,
        bad: state.counter.bad + 1
      }
    }))
  }
}))

export const useUnicafeCounter = () => useUnicafeStore(state => state.counter)
export const useUnicafeControls = () => useUnicafeStore(state => state.actions)