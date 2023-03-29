import { useState, useEffect } from 'react'

type Props = {
  selectRef: React.RefObject<HTMLSelectElement>
  optionIndex: number | null | undefined
}

function useOptionInView({ selectRef, optionIndex }: Props) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (selectRef.current && optionIndex !== undefined && optionIndex !== null) {
      const select = selectRef.current
      const option = select.options[optionIndex]

      if (option) {
        const selectRect = select.getBoundingClientRect()
        const optionRect = option.getBoundingClientRect()

        const inView = optionRect.top >= selectRect.top && optionRect.bottom <= selectRect.bottom

        setInView(inView)
      }
    }
  }, [selectRef, optionIndex])

  return inView
}

export default useOptionInView
