import ghopayabi from "@/utils/contract/ghopayabi"
import { Contract, getDefaultProvider } from "ethers"
import { useMemo } from "react"

export const useContract = (contractAddress?: string) => {
  const provider = getDefaultProvider()

  const contract = useMemo(() => !!contractAddress && new Contract(contractAddress, ghopayabi, provider), [contractAddress])

  return contract
}
