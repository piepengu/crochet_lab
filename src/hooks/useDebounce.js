import { useState, useEffect } from 'react'

/**
 * Returns a debounced value that updates after the specified delay.
 * Useful for reducing re-renders when slider/input values change rapidly.
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in ms before updating
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
