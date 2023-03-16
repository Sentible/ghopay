import React, { useContext, useEffect, useMemo } from "react";
import { useProfileFollowing } from "@lens-protocol/react";

import { formatLink, isTokenExpired } from "@/utils/utils";
import { LENS_CREDS, LENS_PROFILE } from "@/utils/constants";
import { LensProfile } from "@/utils/ghopay";

type LensProfileCtx = {
  followers: LensProfile[]
  profile: LensProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

const getLensCredentials = () => {
  const credentials = localStorage.getItem(LENS_CREDS)

  return credentials ? JSON.parse(credentials) : null
}

export const LensProfileContext = React.createContext<LensProfileCtx>({
  followers: [],
  profile: null,
  setProfile: () => { },
});

export const LensProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [followers, setFollowers] = React.useState<LensProfile[]>([]);
  const [profile, setProfile] = React.useState<any>(null);

  const {
    data
  } = useProfileFollowing({
    observerId: profile?.id,
    limit: 50,
    walletAddress: profile?.ownedBy as string,
  });

  useEffect(() => {
    const credentials = getLensCredentials()
    const _lensProfile = localStorage.getItem(LENS_PROFILE)
    const storedProfile = _lensProfile ? JSON.parse(_lensProfile) : null
    const isValid = credentials && !isTokenExpired(credentials?.refreshToken)

    if (isValid && storedProfile) {
      setProfile(storedProfile)
    }
  }, [])

  useEffect(() => {
    if (data) {
      const remap = data.map(({ profile }) => ({
        ...profile,
        picture: {
          original: {
            url: formatLink((profile.picture as any)?.original?.url)
          }
        } as any
      }))
      const sorted = [...remap].sort((a, b) => a.name?.localeCompare(b.name ?? '') || a.handle.localeCompare(b.handle))
      setFollowers(sorted as LensProfile[])
    }
  }, [data])

  const values = useMemo(() => ({ followers, profile, setProfile }), [followers, profile, setProfile]);

  return (
    <LensProfileContext.Provider value={values}>
      {children}
    </LensProfileContext.Provider>
  );
};

export const useLensProfile = () => useContext(LensProfileContext);
