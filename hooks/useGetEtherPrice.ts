import swr from 'swr'

const url = '/api/ether-price'
const priceFetcher = async () => {
  const response = await fetch(url)
  return response.json() as Promise<{
    ethereum: {
      usd: number
    }
  }>
}

const FIVE_MINUTES = 1000 * 60 * 5

export const useGetEtherPrice = () =>
  swr(url, async () => await priceFetcher(), {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    refreshInterval: FIVE_MINUTES,
  })

export const toWei = (value: string | number, decimals = 18) => {
  const _value = Number(value)
  return _value * Math.pow(10, decimals)
}
