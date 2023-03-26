import swr from "swr";

const url = '/api/zerox-swap';
const quoteFetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json() as Promise<{
    allowanceTarget: string,
    buyAmount: string,
    buyTokenAddress: string,
    data: string,
    price: string,
    sellAmount: string,
    sellTokenAddress: string,
  }>;
}

type Props = {
  buyToken?: string,
  sellToken?: string,
  sellAmount?: string,
}

export const useGetSwapData = ({ buyToken, sellToken, sellAmount }: Props) => {
  const baseURl = `${url}?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}`;
  const hasValidParams = buyToken && sellToken && Number(sellAmount) > 0;
  const key = hasValidParams ? baseURl : null;

  return swr(key, async () => await quoteFetcher(baseURl), { revalidateOnFocus: false, revalidateOnMount: true, refreshInterval: 20000, })
}
