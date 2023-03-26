import { getShortenName } from "@/utils/utils"
import { LensProfile } from "@/utils/ghopay"
import { MiniProfile } from "../ProfileCard"
import { useMemo } from "react"
import Button, { ButtonGroup } from "../Buttons"
import Card from "../Card"
import styled from "styled-components"
import useGetPayData from "@/hooks/useGetPayData"

type Props = {
  profile?: LensProfile | null
  onPay?: () => void
}

const StyledPayCard = styled(Card)`
  background-image: url("/gradient.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  height: 325px;
  max-width: 400px;
  position: relative;
  text-align: center;

  /* blur background only not text */
  &::before {
    background: rgba(255, 255, 255, 0.55);
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
  }

  h4 {
    margin: 0.5rem 0;
    padding: 0;
  }

  ${ButtonGroup} {
    flex-flow: row nowrap;
    position: relative;
    z-index: 2;

    button {
      margin: 0 0.5rem;
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }
  }
`

const SelectedProfile = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 2rem auto;
  padding: 0;
  width: 65%;
  position: relative;
  z-index: 2;

  img {
    border: 4px solid #eee;
  }
`
SelectedProfile.displayName = "SelectedProfile"

const PayInstructions = styled.p`
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  padding: 0;
  position: relative;
  z-index: 2;
`

const COPY = {
  GENERAL: "Enter a handle to get started",
  RECIPIENT: (name: string) => <PayInstructions>{name}</PayInstructions>
}

const PayUserPreview = ({ profile, onPay }: Props) => {
  const { user } = useGetPayData()
  const { ownedBy, picture, name, handle } = profile ?? {}
  const recipientImage = picture?.original?.url

  const Instructions = useMemo(() => {
    if (ownedBy) {
      return COPY.RECIPIENT(name ?? handle ?? getShortenName(ownedBy))
    }

    return (
      <PayInstructions>
        <br />
        {COPY.GENERAL}
      </PayInstructions>
    )
  }, [handle, name, ownedBy])

  return (
    <StyledPayCard>
      {Instructions}
      <SelectedProfile>
        {ownedBy && <MiniProfile address={ownedBy} image={recipientImage} label={`@${handle}`} size={125} viewable />}
      </SelectedProfile>
      {ownedBy && (
        <ButtonGroup className="button-group">
          <Button disabled>Follow</Button>
          <Button disabled={!user} onClick={onPay}>Pay</Button>
          <Button disabled>Request</Button>
        </ButtonGroup>
      )}
    </StyledPayCard>
  )
}

export default PayUserPreview
