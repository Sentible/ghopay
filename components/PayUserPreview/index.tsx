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

const SideBySide = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 3rem auto;
  padding: 0;
  width: 65%;
  position: relative;
  z-index: 2;

  img {
    border: 4px solid #eee;
  }
`
SideBySide.displayName = "SideBySide"

const PayInstructions = styled.p`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: relative;
  z-index: 2;
  margin: 0;
  padding: 0;

  span {
    font-weight: 600;
    font-size: 1.2rem;
  }
`

const COPY = {
  GENERAL: "Enter a handle to get started",
  RECIPIENT: (name: string) => <PayInstructions>You are interacting with <br /><span>@{name}</span></PayInstructions>
}

const PayUserPreview = ({ profile }: Props) => {
  const { user } = useGetPayData()
  const { ownedBy, picture, name, handle } = profile ?? {}
  const recipientImage = picture?.original?.url
  const senderImage = user?.picture?.original?.url

  const Instructions = useMemo(() => {
    if (ownedBy) {
      return COPY.RECIPIENT(handle ?? name ?? getShortenName(ownedBy))
    }

    return (
      <PayInstructions>
        <br />
        {COPY.GENERAL}
      </PayInstructions>
    )
  }, [handle, name, ownedBy])

  if (!user) return null

  return (
    <StyledPayCard>
      {Instructions}
      <SideBySide>
        <MiniProfile address={user?.ownedBy} image={senderImage} label={user?.name} />
        {ownedBy && <MiniProfile address={ownedBy} image={recipientImage} label={name} />}
      </SideBySide>
      {ownedBy && (
        <ButtonGroup className="button-group">
          <Button disabled>Follow</Button>
          <Button>Pay</Button>
          <Button disabled>Request</Button>
        </ButtonGroup>
      )}
    </StyledPayCard>
  )
}

export default PayUserPreview
