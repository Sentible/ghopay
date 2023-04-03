import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

export const StyledInput = styled.input`
  box-shadow: 0px 4px 6px rgba(200, 180, 130, 0.2);
  padding: 1.5rem;
  margin: 0.5rem 0;
  border-radius: 20px;
  border: 1px solid #3c8f5e;
  font-size: 1.5rem;
  width: 100%;

  &:focus {
    outline: none;
  }
`
StyledInput.displayName = 'StyledInput'

const StyledOptionsDropdown = styled.div`
  max-height: 400px;
  overflow-y: auto;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #3c8f5e;
  padding: 2rem;
  z-index: 100;
`

const StyledSearch = styled.div`
  position: relative;
`

const StyledDropdownItem = styled.div`
  padding: 1rem;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background: #abfe2c;
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    color: #38b000;
  }
`

const SearchDropdown = ({
  onClick,
  options = [],
  children = undefined,
  title,
}: {
  onClick?: <T>(value?: T) => void
  title?: string
  options?: string[]
  children?: React.ReactNode
}) => {
  return (
    <StyledOptionsDropdown>
      {/* {children ?? (
        <>
          {title && <h3>{title}</h3>}
          <div>
            {options.map((lens) => (
              <StyledDropdownItem key={lens} onClick={() => onClick?.(lens)}>{lens}</StyledDropdownItem>
            ))}
          </div>
        </>
      )} */}
      {children}
    </StyledOptionsDropdown>
  )
}

const Search = ({
  children = undefined as any,
  onClick = (value: any) => {},
  onChange = (value: any) => {},
  placeholder = 'stani.lens, vitalik.eth, ...0xbc',
  options = [] as any[],
  title = 'Popular Lens',
  value = '',
}) => {
  const [isActive, setIsActive] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const handleClear = useCallback(() => {
    setInputValue('')
    onChange?.('')
    onClick?.('')
  }, [onChange, onClick])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <StyledSearch
      className='search'
      onFocus={() => {
        setIsActive(true)
      }}
      onMouseLeave={() => setIsActive(false)}
    >
      <>
        <StyledInput
          onChange={(e) => {
            setInputValue(e.target.value)
            onChange?.(e.target.value)
          }}
          onMouseDown={() => {
            setIsActive(true)
          }}
          placeholder={placeholder}
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue) {
              onClick?.(inputValue)
              setIsActive(false)
            }

            if (e.key === 'Enter') {
              setIsActive(true)
            }

            if (e.key === 'Escape') {
              setIsActive(false)
            }
          }}
        />
        {inputValue && <ClearButton onClick={handleClear}>✖</ClearButton>}
      </>
      {isActive && (
        <SearchDropdown
          children={children}
          onClick={(item) => {
            onClick(item)
            setIsActive(false)
          }}
          title={title}
          options={options}
        />
      )}
    </StyledSearch>
  )
}

export default Search
