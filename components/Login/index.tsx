import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const LensConnectButton = dynamic(() => import('@/components/Buttons/LensConnect'), { ssr: false });

const WalletConnect = () => {
  const { isConnected, isConnecting } = useAccount();

  if (!isConnecting && isConnected) return null;

  return <ConnectButton />;
};

const StyledLogin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div + div {
    margin-top: 1rem;
  }
`

const Login = () => {
  const { isConnected, isConnecting } = useAccount();

  return (
    <StyledLogin>
      <WalletConnect />
      {isConnected && <LensConnectButton />}
    </StyledLogin>
  );
}

export default Login;
