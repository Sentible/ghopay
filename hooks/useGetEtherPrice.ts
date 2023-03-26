import swr from "swr";

const url = 'https://sentible.app/api/v1/ether-price';
const priceFetcher = async () => {
  const response = await fetch(url);
  return response.json() as Promise<{
    ethereum: {
      usd: number;
    }
  }>;
}

const FIVE_MINUTES = 1000 * 60 * 5;

export const useGetEtherPrice = () => swr(url, async () => await priceFetcher(), { revalidateOnFocus: true, revalidateOnMount: true, refreshInterval: FIVE_MINUTES, })
