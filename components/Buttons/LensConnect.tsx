import React, { useCallback } from 'react';
import { useAccount } from 'wagmi';

import { LENS_CREDS, LENS_PROFILE } from '@/utils/constants';
import { SignInWithLens, Theme, Size } from '@lens-protocol/widgets-react'
import { useLensProfile } from '@/utils/store/LensProfile';

export default function LensConnect() {
  const { isConnected } = useAccount();
  const { profile, setProfile } = useLensProfile();

  const onLoginClick = useCallback(async (tokens: any, profile: any) => {
    setProfile(profile);
    localStorage.setItem(LENS_PROFILE, JSON.stringify(profile))
    localStorage.setItem(LENS_CREDS, JSON.stringify(tokens))
  }, [setProfile])

  const isReady = isConnected && profile !== null

  return (
    <div>
      {!isReady && (
        <SignInWithLens
          theme={Theme.green}
          size={Size.large}
          onSignIn={onLoginClick}
        />
      )}
    </div>
  );
}

