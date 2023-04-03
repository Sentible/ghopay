import styled from 'styled-components'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

const StyledButton = styled.button`
  background: #007200;
  border: 1px solid #008A34;
  box-shadow: 0px 4px 6px rgba(0, 50, 0, 0.2);
  border-radius: 20px;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  cursor: pointer;
  width: 100%;
  color: #eee;
  &:hover {
    &:not([disabled]) {
      background: #008000;
    }
  }

  &:disabled&:hover {
    background: #007200;
    cursor: initial;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
ButtonGroup.displayName = 'ButtonGroup'

const Button = (props: ButtonProps) => {
  const { children, className, ...rest } = props

  const cN = className ? `${className} button` : 'button'
  return (
    <StyledButton className={cN} {...rest}>
      {children}
    </StyledButton>
  )
}

export default Button
