import { CustomAvatar } from "@/pages"
import styled from "styled-components"

const StyledMiniProfile = styled.div`
  align-self: flex-start;
  max-width: 12ch;
  user-select: none;
  white-space: nowrap;

  img {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .label {
    font-size: 0.75rem;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`
StyledMiniProfile.displayName = "StyledMiniProfile"


export const MiniProfile = ({ address = '', image = '', label = '', size = 100, onClick = () => { } }) => {
  return (
    <StyledMiniProfile className="mini-profile" onClick={onClick}>
      <CustomAvatar address={address as string} ensImage={image} size={size} />
      <p className="label">{label}</p>
    </StyledMiniProfile>
  )
}
