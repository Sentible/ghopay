import { useAccount, useNetwork } from "wagmi";
import swr from "swr";
import { useCallback, useEffect, useMemo, useState } from "react";

const enum QUERY_KEYS {
  tokenBalance = 'alchemy_getTokenBalances',
  tokenMetadata = 'alchemy_getTokenMetadata'
}

export interface TokenMetaResult {
  jsonrpc: string
  id: number
  result: {
    decimals: number | null
    logo: string | null
    name: string
    symbol: string | null
  }
}
const baseURl = 'https://eth-mainnet.alchemyapi.io/v2/ZHPkXUR4wLVFFa5X0i9mAXznYu-ZM3K4';

const options = (address = '', method: QUERY_KEYS, id = 1) => ({
  method: 'POST',
  headers: { accept: 'application/json', 'content-type': 'application/json' },
  body: JSON.stringify({
    id,
    jsonrpc: '2.0',
    method,
    params: [address]
  })
});

const filterEmpty = (data: AlchemyToken[]) => data.filter(({ tokenBalance }) => Number(tokenBalance) > 0.00000001);

const tokenFetcher = async (address: string, id: number) => {
  const _options = options(address, QUERY_KEYS.tokenMetadata, id);
  const response = await fetch(baseURl, _options);
  return response.json();
};

const tokenBalanceFetcher = async (url: string, address: string) => {
  const _options = options(address, QUERY_KEYS.tokenBalance);
  const response = await fetch(url, _options);
  return response.json();
};

export const useFetchTokenMetadata = (address?: string, id?: number) => swr((address && id) ? address : null, async () => await tokenFetcher(address!, id!), { revalidateOnFocus: false, revalidateOnMount: true, refreshInterval: 1000 * 60 * 5, }) as {
  data: {
    jsonrpc: string
    id: number
    result: TokenMetaResult['result'] | undefined
  }, error: any, isValidating: boolean
};

const useFetchTokenByNetwork = (url = '', address: string) => swr(url || null, async () => await tokenBalanceFetcher(url!, address!), { revalidateOnFocus: false, revalidateOnMount: true });


export type AlchemyToken = {
  contractAddress: string;
  tokenBalance: string;
  networkName?: string;
  networkId?: number;
}

export const useGetTokens = () => {
  const { chains, chain } = useNetwork();
  const { address = '', isConnected } = useAccount();

  const currentChain = useMemo(() => chains.find(({ id }) => id === chain?.id), [chain, chains]);
  const isGoerli = currentChain?.id === 5;
  const isOptimism = currentChain?.id === 10;
  const isPolygon = currentChain?.id === 137;

  const { arbitrum, mainnet, goerli, optimism, polygon } = useMemo(() => ({
    arbitrum: chains.find(({ id }) => id === 42161),
    mainnet: chains.find(({ id }) => id === 1),
    goerli: chains.find(({ id }) => id === 5),
    optimism: chains.find(({ id }) => id === 10),
    polygon: chains.find(({ id }) => id === 137),
  }), [chains.length]);

  const {
    arbitrumDefaultRpcUrl,
    mainnetDefaultRpcUrl,
    goerliDefaultRpcUrl,
    optimismDefaultRpcUrl,
    polygonDefaultRpcUrl,
  } = useMemo(() => ({
    arbitrumDefaultRpcUrl: arbitrum?.rpcUrls?.['default']?.http?.[0],
    mainnetDefaultRpcUrl: mainnet?.rpcUrls?.['default']?.http?.[0],
    goerliDefaultRpcUrl: goerli?.rpcUrls?.['default']?.http?.[0],
    optimismDefaultRpcUrl: optimism?.rpcUrls?.['default']?.http?.[0],
    polygonDefaultRpcUrl: polygon?.rpcUrls?.['default']?.http?.[0],
  }), [goerli, polygon, optimism]);

  const goerliData = (useFetchTokenByNetwork(goerliDefaultRpcUrl, address)?.data?.result?.tokenBalances ?? []) as AlchemyToken[]
  const optimismData = (useFetchTokenByNetwork(optimismDefaultRpcUrl, address)?.data?.result?.tokenBalances ?? []) as AlchemyToken[]
  const polygonData = (useFetchTokenByNetwork(polygonDefaultRpcUrl, address)?.data?.result?.tokenBalances ?? []) as AlchemyToken[]
  const mainnetData = (useFetchTokenByNetwork(mainnetDefaultRpcUrl, address)?.data?.result?.tokenBalances ?? []) as AlchemyToken[]
  const arbitrumData = (useFetchTokenByNetwork(arbitrumDefaultRpcUrl, address)?.data?.result?.tokenBalances ?? []) as AlchemyToken[]

  const {
    arbitrum: arbitrumTokens,
    mainnet: mainnetTokens,
    goerli: goerliTokens,
    optimism: optimismTokens,
    polygon: polygonTokens,
  } = useMemo(() => ({
    goerli: filterEmpty(goerliData).map((t) => ({
      ...t,
      networkId: goerli?.id,
      networkName: goerli?.name,
    })),
    optimism: filterEmpty(optimismData).map((t) => ({
      ...t,
      networkId: optimism?.id,
      networkName: optimism?.name,
    })),
    polygon: filterEmpty(polygonData).map((t) => ({
      ...t,
      networkId: polygon?.id,
      networkName: polygon?.name,
    })),
    arbitrum: filterEmpty(arbitrumData).map((t) => ({
      ...t,
      networkId: arbitrum?.id,
      networkName: arbitrum?.name,
    })),
    mainnet: filterEmpty(mainnetData).map((t) => ({
      ...t,
      networkId: mainnet?.id,
      networkName: mainnet?.name,
    })),
  }) as Record<string, AlchemyToken[]>, [goerliData, optimismData, polygonData, mainnetData, arbitrumData]);

  const tokens = useMemo(() => {
    const _tokens = [...mainnetData, ...goerliTokens, ...optimismTokens, ...polygonTokens, ...arbitrumTokens];
    return _tokens;
  }, [mainnetData, goerliTokens, optimismTokens, polygonTokens, arbitrumTokens]);

  useEffect(() => {
    if (!isConnected) return;
  }, [isConnected]);

  return {
    address,
    tokens,
  };

}
