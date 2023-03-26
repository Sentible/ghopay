import { usePrevious } from "@/hooks/usePrevious"
import { CustomAvatar } from "@/pages"
import { useEffect, useState } from "react"
import styled from "styled-components"

const StyledMiniProfile = styled.div`
  align-self: flex-start;
  max-width: 12ch;
  user-select: none;
  white-space: nowrap;

  &.true img {
    cursor: pointer;
  }

  img {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .label {
    font-size: 0.75rem;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
`
StyledMiniProfile.displayName = "StyledMiniProfile"

type Props = {
  address?: string
  image?: string
  label?: string
  size?: number
  onClick?: () => void
  viewable?: boolean
  index?: number
}

const viewUrl = (address: string) => `https://sentible.app/view/${address}/nfts`
export const MiniProfile = ({ address = '', image = '', label = '', size = 100, onClick, viewable, index }: Props) => {
  const className = [
    "mini-profile",
    viewable
  ].join(" ")

  const [img, setImg] = useState<string | undefined>()

  const prevImage = usePrevious(image)

  useEffect(() => {
    if (image !== prevImage) {
      setImg(image)
    } else {
      setImg(undefined)
    }
    return () => {
      setImg(undefined)
    }
  }, [image, prevImage])


  return (
    <StyledMiniProfile className={className} onClick={(e) => {
      const isImage = e.target instanceof HTMLImageElement
      if (viewable && address && isImage) {
        window.open(viewUrl(address), "_blank")
      } else {
        onClick?.()
      }
    }} tabIndex={index}>
      <CustomAvatar address={address as string} ensImage={img} size={size} />
      <p className="label">{label}</p>
    </StyledMiniProfile>
  )
}
