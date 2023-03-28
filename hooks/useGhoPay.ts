import ghopayabi from "@/utils/contract/ghopayabi"
import { Contract, getDefaultProvider } from "ethers"
import { useCallback, useMemo, useState } from "react"
import { useAccount, useSigner, useSwitchNetwork } from "wagmi"
import Web3 from "web3"
import { toWei } from "./useGetEtherPrice"
import { useGetSwapData } from "./useGetSwapData"

const GHO_PAY_ADDRESS = {
  5: "0xE773B680cC99F0a02F9a0f2dC43b294d981F0702",
} as Record<number, string>

const WETH_GATEWAY_ADDRESS = {
  5: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
} as Record<number, string>

export const useGhoPay = () => {
  const { data: signer, isError, isLoading } = useSigner()
  const { address } = useAccount()
  const { switchNetworkAsync, data: currentChain } = useSwitchNetwork()
  const provider = getDefaultProvider()

  const isGoerli = currentChain?.id === 5
  const networkId = provider.network.chainId
  const wethAddress = WETH_GATEWAY_ADDRESS[networkId] ?? WETH_GATEWAY_ADDRESS[5]

  const [amountInWei, setAmountInWei] = useState<string | undefined>()
  const [isPaying, setIsPaying] = useState(false)
  const [recipient, setRecipient] = useState<string | undefined>()

  const { data } = useGetSwapData({
    sellToken: wethAddress,
    buyToken: '0x9FD21bE27A2B059a288229361E2fA632D8D2d074',
    sellAmount: amountInWei,
  })

  const ghoPay = useMemo(() => {
    if (Web3) {
      const contractAddress = GHO_PAY_ADDRESS[networkId] ?? GHO_PAY_ADDRESS[5]
      const web3 = new Web3(Web3.givenProvider)
      const contract = new web3.eth.Contract(ghopayabi as any, contractAddress)
      return contract
    }
  }, [networkId])

  const handlePayment = useCallback(async () => {
    if (amountInWei && data && recipient && !isPaying) {
      setIsPaying(true)
      const action = ghoPay?.methods.wrapETHAndPay(
        data.sellTokenAddress,
        data.buyTokenAddress,
        data.sellAmount,
        data.allowanceTarget,
        data.allowanceTarget,
        data.data,
        recipient,
      )
      const estimateGas = await action.estimateGas({ value: amountInWei })
      console.log({ action }, estimateGas)
      return action.send({
        from: address,
        value: amountInWei,
        gasLimit: estimateGas,
      }).on('transactionHash', (hash: string) => {
        console.info(hash)
        setIsPaying(false)
        localStorage.setItem('deposit', hash)
        window.open(`https://goerli.etherscan.io/tx/${hash}`, '_blank')
        // depositingToast(`Depositing ${depositAmount} ${symbol}`)
      })
        .on('receipt', (receipt: any) => {
          console.info(receipt)
          const txPass = receipt.status === true
          setIsPaying(false)
          // setIsSuccess(txPass)
          // clearState()
          // getAllowance()
          // getBalance()
          // if (txPass) {
          //   successToast(`Deposited ${depositAmount} ${symbol}!`)
          // } else {
          //   errorToast()
          // }
        })
        .on('error', (error: any) => {
          console.info('error', error)
          setIsPaying(false)
          // setIsSuccess(false)
          // getAllowance()
          // getBalance()
          // setIsDepositing(false)
          // if (error?.code === 4001) {
          //   errorToast('Deposit cancelled.')
          // } else {
          //   errorToast()
          // }
        })
    }
  }, [amountInWei, data, ghoPay, address, recipient, isPaying])

  // const wethPay = useCallback(async ({
  //   amount,
  //   to,
  // }: {
  //   amount: number
  //   to: string
  // }) => {
  //   const toSend = toWei(amount).toString()
  //   setAmountInWei(toSend)
  //   setRecipient(to)
  //   await handlePayment()
  // }, [handlePayment])
  const wethPay = useCallback(async ({
    amount,
    to,
  }: {
    amount: number
    to: string
  }) => {
    const toSend = toWei(amount).toString()
    setAmountInWei(toSend)
    setRecipient(to)
  }, [])

  const initPayment = useCallback(async () => {
    if (!isGoerli && switchNetworkAsync) {
      await switchNetworkAsync(5)
    } else {
      await handlePayment()
    }
  }, [isGoerli, switchNetworkAsync, handlePayment])

//   const { paymentToken, settleToken } = useMemo(() => {
//     const paymentToken = paymentTokenAddress ? new Contract(paymentTokenAddress, ghopayabi, provider) : undefined
//     const settleToken = settleTokenAddress ? new Contract(settleTokenAddress, ghopayabi, provider) : undefined

//     return { paymentToken, settleToken }
//   }, [paymentTokenAddress, settleTokenAddress])

//   return { paymentToken, settleToken }

  return { ghoPay, wethPay, isPaying, setIsPaying, handlePayment: initPayment }
}


export const useWethGateway = () => {
  const provider = getDefaultProvider()

  const wethGateway = useMemo(() => {
    return new Contract("0x8e9a29e7e1dcbbdecb2442282a1fd7d7a9c3e01a", ghopayabi, provider)
  }, [])

  return { wethGateway }
}
