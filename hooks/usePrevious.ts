import { useRef, useEffect } from 'react'

export const usePrevious: <T>(value: T) => T = (value) => {
  const ref = useRef() as React.MutableRefObject<typeof value>
  useEffect(() => {
    if (ref?.current) {
      ref.current = value
    }
  }, [value])
  return ref.current
}
