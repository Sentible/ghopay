
import styled from 'styled-components';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};


const StyledButton = styled.button`
  background: #abfe2c;
  border: 1px solid #abfe2c;
  border-radius: 20px;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  cursor: pointer;
  width: 100%;
  &:hover {
    &:not([disabled]) {
      background: #fff;
    }
  }

  &:disabled&:hover {
    background: #abfe2c;
    cursor: initial;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
ButtonGroup.displayName = 'ButtonGroup'

const Button = (props: ButtonProps) => {
  const { children, className, ...rest } = props;

  const cN = className ? `${className} button` : 'button';
  return (
    <StyledButton className={cN} {...rest}>
      {children}
    </StyledButton>
  );
};

export default Button;
