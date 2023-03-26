import React, { useContext, useState, useMemo } from "react";
import { useProfileFollowing } from "@lens-protocol/react";
import { Contract } from "ethers";
import { AlchemyToken, useGetTokens } from "@/hooks/useGetTokens";
import { useBalance } from "wagmi";

type GhoPayCtx = {
  paymentToken?: AlchemyToken;
  settleToken?: AlchemyToken;
  setPaymentToken: React.Dispatch<React.SetStateAction<AlchemyToken | undefined>>;
}
export const GhoPayContext = React.createContext<GhoPayCtx>({
  paymentToken: undefined,
  settleToken: undefined,
  setPaymentToken: () => { },
});

export const GhoPayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const [paymentToken, setPaymentToken] = useState<AlchemyToken>()
  const [settleToken, setSettleToken] = useState<AlchemyToken>()

  useGetTokens()

  console.log('GhoPayProvider', paymentToken, settleToken)

  const values = useMemo(() => ({
    paymentToken,
    settleToken,
    setPaymentToken,
  }), [paymentToken, settleToken, setPaymentToken])

  return (
    <GhoPayContext.Provider value={values}>
      {children}
    </GhoPayContext.Provider>
  );
};

export const useGhoPayCtx = () => useContext(GhoPayContext);
