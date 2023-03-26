import { useEnsAddress, useEnsName } from "wagmi";

function isAddress(address: string) {
  return /^(0x)?[0-9a-f]{40}$/i.test(address);
}

function isENSName(name: string) {
  return name?.includes('.eth');
}

export const useENS = (addressOrEnsName: any) => {
  const isaddress = isAddress(addressOrEnsName);
  const isName = isENSName(addressOrEnsName);

  const { data: address, isLoading: addressLoading } = useEnsAddress({
    name: addressOrEnsName,
    chainId: 1,
  });

  const { data: name, isLoading: nameLoading } = useEnsName({
    address: addressOrEnsName,
    chainId: 1,
  });

  return {
    address: isaddress ? addressOrEnsName : address?.toString(),
    name: isName ? addressOrEnsName : name?.toString(),
    // avatar: name ? `https://metadata.ens.domains/mainnet/avatar/${name}` : '',
    loading: addressLoading || nameLoading,
  };
};
