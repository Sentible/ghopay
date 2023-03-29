import Button from '@/components/Buttons'
import { StyledInput } from '@/components/Inputs/Search'
import Modal, { useModal } from '@/components/Modal'
import PayUserPreview from '@/components/PayUserPreview'
import PayUserSelect from '@/components/PayUserSelect'
import { MiniProfile } from '@/components/ProfileCard'
import useGetPayData from '@/hooks/useGetPayData'
import { useGetEtherPrice } from '@/hooks/useGetEtherPrice'
import { AlchemyToken, useFetchTokenMetadata, useGetTokens } from '@/hooks/useGetTokens'
import { useGhoPayCtx } from '@/utils/store/GhoPayContext'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useBalance, useNetwork } from 'wagmi'
import { currencyFormatter, numberFormatter } from '@/utils/utils'

const SideBySide = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 2rem auto;
  padding: 0;
  width: 65%;
  position: relative;
  z-index: 2;

  @media (max-width: 414px) {
    margin: initial;
    margin-top: 3rem;
    margin-bottom: 2rem;
    justify-content: center;
    width: 100%;
  }

  img {
    border: 4px solid #eee;
  }

  .mini-profile {
    &:nth-child(1) {
      animation: slide-in-profile-one 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }

    &:nth-child(3) {
      animation: slide-in-profile-two 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }

    @media (max-width: 768px) {
      img {
        height: 100px;
        width: 100px;
      }
    }
  }

  @keyframes slide-in-profile-one {
    0% {
      transform: translateX(-100px);
      opacity: 0;
    }

    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-in-profile-two {
    0% {
      transform: translateX(100px);
      opacity: 0;
    }

    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
`

const PayIcon = styled.span`
  /* slide in animation */
  animation: slide-in 0.75s linear 0s, wiggle 2s infinite linear 60s;
  font-size: 3rem;
  font-weight: 600;
  margin: 0 1rem;
  position: relative;
  user-select: none;

  @keyframes slide-in {
    0% {
      transform: translateY(100px);
      opacity: 0;
    }

    50% {
      transform: translateY(10px);
      opacity: 0.5;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes wiggle {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(5deg);
    }
    50% {
      transform: rotate(0deg);
    }
    75% {
      transform: rotate(-5deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`

const ModalInstructions = styled.div`
  p {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  h2 {
    margin: 0;
  }
`

const PaymentSelection = styled.div`
  .token-info {
    > p {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }
  }
`
PaymentSelection.displayName = 'PaymentSelection'

const PaymentForm = styled.div`
  .button {
    margin-top: 0.25rem;
  }
  .payment-input {
    display: flex;
    position: relative;
    width: 100%;
    ${StyledInput} {
      padding: 1rem 5rem 1rem 1.5rem;
      font-size: 1.3rem;
    }

    .img-holder {
      position: absolute;
      width: 45px;
      right: 1rem;
      bottom: 0.6rem;
      img {
        border-radius: 50%;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        user-select: none;
        width: 100%;
      }
    }
  }

  .instructions {
    margin: 0.25rem;
    color: #5e5e5e;
    font-size: 0.75rem;
    padding-left: 0.5rem;
  }
`
PaymentForm.displayName = 'PaymentForm'

const MaxButton = styled.button`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0;
  padding: 0.5rem;
  position: absolute;
  right: 1rem;
  top: -1.8rem;
  user-select: none;
`

const UserBalance = styled.p`
  color: #5e5e5e;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0;
  padding: 0;
  padding-left: 0.5rem;
  position: absolute;
  right: 4rem;
  top: -1.3rem;
`

const StyledTokenSelect = styled.div`
  height: 400px;
  overflow: hidden;

  ${ModalInstructions} {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding-bottom: 1rem;

    .go-back {
      cursor: pointer;
      position: relative;
      top: -3px;
    }
  }

  .tokens {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    height: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-y: scroll;

    .token-item {
      align-items: center;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      margin: 0.5rem;
      padding: 0.5rem;
      width: 20%;
      user-select: none;
      transition: all 0.2s ease-in-out;

      &:hover {
        border: 1px solid #ccc;
      }
    }
  }
`
StyledTokenSelect.displayName = 'StyledTokenSelect'

const SelectedToken = ({
  onToggle,
  token,
  visible,
}: {
  onToggle: () => void
  token: AlchemyToken
  visible?: boolean
}) => {
  const { networkId, contractAddress } = token || {}
  const { chain } = useNetwork()

  const { data } = useFetchTokenMetadata(contractAddress ? (null as any) : contractAddress, chain?.id)

  const formattedToken = useMemo(() => {
    return {
      ...token,
      ...(data?.result
        ? {
            decimals: data.result?.decimals,
            name: data.result?.name,
            symbol: data.result?.symbol,
            logo: data.result?.logo,
            tokenBalance: data.result?.decimals
              ? Number(token.tokenBalance) / 10 ** data.result?.decimals
              : token.tokenBalance,
          }
        : {}),
    }
  }, [data, token, contractAddress])

  const zeroBalance = formattedToken?.tokenBalance === 0

  const isEmpty =
    formattedToken?.decimals === 0 || (!formattedToken?.name && !formattedToken?.symbol && !formattedToken?.decimals)

  if (isEmpty || zeroBalance) {
    return null
  }

  const logo = formattedToken?.logo

  return (
    <div
      className='token-item img-holder'
      onClick={(e) => {
        e.preventDefault()
        console.log('clicked')
        onToggle()
      }}
    >
      {logo ? (
        <img height={'50px'} width={'50px'} src={logo} alt='RPL' />
      ) : (
        formattedToken?.symbol || formattedToken?.name
      )}
    </div>
  )
}

const TokenSelect = ({ goBack = () => {}, onTokenSelect = (token: AlchemyToken) => {} }) => {
  const { tokens } = useGetTokens()

  return (
    <StyledTokenSelect>
      <ModalInstructions>
        <p>
          <span className='go-back' title='go back' onClick={goBack}>
            {' '}
            👈{' '}
          </span>
          Choose a token
        </p>
      </ModalInstructions>
      <div className='tokens'>
        {tokens?.map((token, i) => (
          // <div className="token-item" key={token?.contractAddress}>
          //   <p onClick={() => onTokenSelect(token)}>hi {Number(token?.tokenBalance) / Math.pow(10, 18)}</p>
          // </div>
          <SelectedToken key={`${i}-${token?.contractAddress}`} token={token} onToggle={() => onTokenSelect(token)} />
        ))}
      </div>
    </StyledTokenSelect>
  )
}

const PayPreview = () => {
  const { set_id, toProfile, user } = useGetPayData()
  const { paymentToken, setPaymentToken, wethPay, isPaying, setIsPaying, handlePayment } = useGhoPayCtx()

  const { data: userBalance } = useBalance({
    address: user?.ownedBy as any,
  })

  const { data } = useGetEtherPrice()

  const { isModalOpen, openModal, closeModal } = useModal()

  const [showTokenSelect, setShowTokenSelect] = useState(false)
  const [value, setValue] = useState(0)

  const { ownedBy, picture, name, handle } = toProfile ?? {}

  const isMaxBalance = value + Number(userBalance?.formatted) * 0.0005 === Number(userBalance?.formatted)
  const recipientImage = picture?.original?.url
  const senderImage = user?.picture?.original?.url

  const disabled = !value || value > Number(userBalance?.formatted) || isPaying

  console.log('value', value, disabled)

  const valueToUsd = useMemo(() => {
    const ethPrice = data?.ethereum?.usd || 1700
    return currencyFormatter.format(value * ethPrice)
  }, [data, value])

  useEffect(() => {
    if (!isModalOpen) {
      setValue(0)
      setShowTokenSelect(false)
      setIsPaying(false)
    }
  }, [isModalOpen, setIsPaying])

  useEffect(() => {
    wethPay({
      amount: value,
      to: toProfile?.ownedBy ?? '',
    })
  }, [value, toProfile, wethPay])

  return (
    <>
      <PayUserPreview onPay={() => openModal()} profile={toProfile} />
      <PayUserSelect setValue={set_id} />
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {showTokenSelect ? (
            <TokenSelect
              goBack={() => {
                setShowTokenSelect(false)
              }}
              onTokenSelect={(token) => {
                setPaymentToken(token)
                setShowTokenSelect(false)
              }}
            />
          ) : (
            <>
              <ModalInstructions>
                <p>You are Paying</p>
                <h2>{handle}</h2>
              </ModalInstructions>
              <SideBySide>
                {user?.ownedBy && (
                  <MiniProfile address={user?.ownedBy} image={senderImage} label={`@${user?.handle}`} size={125} />
                )}
                <PayIcon>🤝</PayIcon>
                {ownedBy && <MiniProfile address={ownedBy} image={recipientImage} label={`@${handle}`} size={125} />}
              </SideBySide>
              <PaymentSelection className='payment-selection'>
                <div className='token-info'>
                  <PaymentForm className='payment-form'>
                    <p className='instructions'>{`Pay ${numberFormatter.compact(value)} ETH (${valueToUsd})`}</p>
                    <div className='payment-input'>
                      <MaxButton
                        disabled={isMaxBalance}
                        onClick={() => {
                          const balance = Number(userBalance?.formatted)
                          const minBalance = balance * 0.0005
                          const max = balance - minBalance
                          setValue(max)
                        }}
                      >
                        MAX
                      </MaxButton>
                      <UserBalance>{numberFormatter.compact(userBalance?.formatted)}</UserBalance>
                      <StyledInput
                        placeholder='0.001234'
                        min='0'
                        type='number'
                        onChange={(e) => {
                          setValue(Number(e.target.value))
                        }}
                        value={value}
                      />
                      <div
                        className='img-holder'
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('clicked')
                          // setShowTokenSelect(true)
                        }}
                      >
                        <img src='/eth.png' alt={userBalance?.symbol} />
                      </div>

                      {/* {paymentToken ? <SelectedToken token={paymentToken} onToggle={() => setShowTokenSelect(true)} visible /> :
                        <div className="img-holder" onClick={(e) => {
                          e.preventDefault()
                          console.log('clicked')
                          setShowTokenSelect(true)
                        }}>
                          <img src='/rpl.png' alt="RPL" />
                        </div>
                      } */}
                      {/* <p>1 RPL = 0.000000000000000001 ETH</p> */}
                    </div>
                    <Button
                      disabled={disabled}
                      onClick={() => {
                        if (toProfile?.ownedBy && value) {
                          console.log('paying')
                          handlePayment()
                        }
                      }}
                    >
                      {isPaying ? 'Processing...' : 'Send'}
                    </Button>
                    <p className='instructions'>
                      {/* To change the token you are paying with, click on the token icon above. */}
                      Payments will be settled in ETH & USDC for now. Please connect to Goerli testnet.
                    </p>
                  </PaymentForm>
                </div>
              </PaymentSelection>
            </>
          )}
        </Modal>
      </div>
    </>
  )
}

export default PayPreview
