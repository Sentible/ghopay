import ghopayabi from "@/utils/contract/ghopayabi"
import { Contract, getDefaultProvider } from "ethers"
import { useMemo } from "react"

type Props = {
  paymentTokenAddress?: string
  settleTokenAddress?: string
}

const GHO_PAY_ADDRESS = {
  5: "0x9DCCB25DC86b3A45bDF9DC4b9520EA77603897fA",
} as Record<number, string>

export const useGhoPay = ({ paymentTokenAddress, settleTokenAddress }: Props) => {
  const provider = getDefaultProvider()
  const networkId = provider.network.chainId

  const ghoPay = useMemo(() => {
    const contractAddress = GHO_PAY_ADDRESS[networkId] ?? GHO_PAY_ADDRESS[5]
    return new Contract(contractAddress, ghopayabi, provider)
  }, [provider])

  const { paymentToken, settleToken } = useMemo(() => {
    const paymentToken = paymentTokenAddress ? new Contract(paymentTokenAddress, ghopayabi, provider) : undefined
    const settleToken = settleTokenAddress ? new Contract(settleTokenAddress, ghopayabi, provider) : undefined

    return { paymentToken, settleToken }
  }, [paymentTokenAddress, settleTokenAddress])

  return { paymentToken, settleToken }
}


export const useWethGateway = () => {
  const provider = getDefaultProvider()

  const wethGateway = useMemo(() => {
    return new Contract("0x8e9a29e7e1dcbbdecb2442282a1fd7d7a9c3e01a", ghopayabi, provider)
  }, [])

  return { wethGateway }
}
