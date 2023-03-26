import React, { useContext, useState, useMemo } from "react";
import { useProfileFollowing } from "@lens-protocol/react";
import { Contract } from 'web3-eth-contract'
import { AlchemyToken, useGetTokens } from "@/hooks/useGetTokens";
import { useBalance } from "wagmi";
import { useGhoPay } from "@/hooks/useGhoPay";

type GhoPayCtx = {
  ghoPay: Contract | undefined;
  wethPay: ({ amount, to }: {
    amount: number;
    to: string;
  }) => void;
  isPaying: boolean;
  setIsPaying: React.Dispatch<React.SetStateAction<boolean>>;
  paymentToken?: AlchemyToken;
  settleToken?: AlchemyToken;
  setPaymentToken: React.Dispatch<React.SetStateAction<AlchemyToken | undefined>>;
}
export const GhoPayContext = React.createContext<GhoPayCtx>({
  ghoPay: {} as Contract,
  wethPay: () => { },
  isPaying: false,
  setIsPaying: () => { },
  paymentToken: undefined,
  settleToken: undefined,
  setPaymentToken: () => { },
});

export const GhoPayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const { ghoPay, wethPay, isPaying, setIsPaying } = useGhoPay()
  const [paymentToken, setPaymentToken] = useState<AlchemyToken>()
  const [settleToken, setSettleToken] = useState<AlchemyToken>()

  useGetTokens()

  const values = useMemo(() => ({
    paymentToken,
    settleToken,
    setPaymentToken,
    ghoPay,
    setIsPaying,
    isPaying,
    wethPay
  }), [paymentToken, settleToken, setPaymentToken, ghoPay, wethPay, isPaying, setIsPaying])
  return (
    <GhoPayContext.Provider value={values}>
      {children}
    </GhoPayContext.Provider>
  );
};

export const useGhoPayCtx = () => useContext(GhoPayContext);
