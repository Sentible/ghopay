import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  padding: 1.5rem;
  margin: 0.5rem 0;
  border-radius: 20px;
  border: 1px solid #abfe2c;
  font-size: 1.5rem;
  width: 100%;
`

const StyledOptionsDropdown = styled.div`
  max-height: 400px;
  overflow-y: auto;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #abfe2c;
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
    color: #abfe2c;
  }
`;

const SearchDropdown = ({ onClick, options = [], children = undefined, title }: {
  onClick?: <T>(value?: T) => void,
  title?: string,
  options?: string[],
  children?: React.ReactNode
}) => {
  console.log('children', children)
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
  onClick = (value: any) => { },
  onChange = (value: any) => { },
  placeholder = 'stani.lens, vitalik.eth, ...0xbc',
  options = [] as any[],
  title = 'Popular Lens',
  value = ''
}) => {
  const [isActive, setIsActive] = useState(true);
  const [inputValue, setInputValue] = useState(value);

  const handleClear = useCallback(() => {
    setInputValue("");
    onChange?.("");
    onClick?.("");
  }, [onChange, onClick]);

  useEffect(() => {
    setInputValue(value);
  }, [value])

  return (
    <StyledSearch onMouseLeave={() => setIsActive(false)}>
      <>
        <StyledInput onChange={(e) => {
          setInputValue(e.target.value);
          onChange?.(e.target.value);
        }} onMouseDown={() => {
          setIsActive(true);
        }} placeholder={placeholder} value={inputValue} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onClick?.(inputValue);
            setIsActive(false);
          }

          if (e.key === 'Escape') {
            setIsActive(false);
          }
        }} />
        {inputValue && <ClearButton onClick={handleClear}>✖</ClearButton>}
      </>
      {isActive && (<SearchDropdown children={children} onClick={(item) => {
        onClick(item)
        setIsActive(false)
      }} title={title} options={options} />)}
    </StyledSearch>
  )
}

export default Search
