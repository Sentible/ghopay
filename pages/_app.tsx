import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { arbitrum, goerli, mainnet, optimism, polygon } from 'wagmi/chains'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { CustomAvatar } from '.'
import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { LensConfig, LensProvider, production } from '@lens-protocol/react'
import { LensProfileProvider } from '@/utils/store/LensProfile'
import { localStorage } from '@lens-protocol/react/web'
import { publicProvider } from 'wagmi/providers/public'
import type { AppProps } from 'next/app'
import { GhoPayProvider } from '@/utils/store/GhoPayContext'
import { toast, ToastContainer } from 'react-toastify'
import styled from 'styled-components'

const { chains, provider, webSocketProvider } = configureChains(
  [
    // mainnet,
    polygon,
    // optimism,
    // arbitrum,
    goerli,
  ],
  [alchemyProvider({ apiKey: 'ZHPkXUR4wLVFFa5X0i9mAXznYu-ZM3K4' }), publicProvider()],
)

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: production,
  storage: localStorage(),
}

const { connectors } = getDefaultWallets({
  appName: 'GhoPay',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

const StyledApp = styled.div`
  /* background: #0f0c29;
background: -webkit-linear-gradient(0deg, #24243e, #302b63, #0f0c29);
background: linear-gradient(0deg, #24243e, #302b63, #0f0c29); */

  background: #4b6cb7; /* fallback for old browsers */
  background: -webkit-linear-gradient(0deg, #182848, #4b6cb7); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    0deg,
    #182848,
    #4b6cb7
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .modal-overlay {
    .modal {
      @media (max-width: 768px) {
        margin: 1rem;
        padding: 1rem;
      }
    }
  }

  .pay-card {
    @media (max-width: 414px) {
      max-width: 360px;
    }
  }

  .Toastify__toast-container {
    z-index: 999999;
    @media (max-width: 768px) {
      display: flex;
      top: 2vh;
      flex-direction: column-reverse;
      .Toastify__toast {
        margin-bottom: 1rem;
      }
    }
  }
`
StyledApp.displayName = 'StyledApp'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} showRecentTransactions theme={darkTheme()} avatar={CustomAvatar}>
        <LensProvider config={lensConfig}>
          <LensProfileProvider>
            <GhoPayProvider>
              <ToastContainer
                theme='dark'
                position='top-right'
                autoClose={5000}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover
                limit={3}
              />
              <StyledApp>
                <Component {...pageProps} />
              </StyledApp>
            </GhoPayProvider>
          </LensProfileProvider>
        </LensProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
