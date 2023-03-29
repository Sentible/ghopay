import { LensProfile } from '@/utils/ghopay'
import { useLensProfile } from '@/utils/store/LensProfile'
import { formatLink } from '@/utils/utils'
import { useProfile } from '@lens-protocol/react'
import { useEffect, useState } from 'react'

const useGetPayData = () => {
  const [_id, set_id] = useState<string | null>(null)
  const [toProfile, setToProfile] = useState<LensProfile | undefined>(undefined)

  const { profile: user, followers } = useLensProfile()
  const { data: recipient } = useProfile({
    handle: _id?.match('.lens') ? _id : (undefined as any),
  }) as { data: LensProfile | undefined }

  useEffect(() => {
    if (recipient) {
      setToProfile({
        ...recipient,
        picture: {
          original: {
            url: formatLink(recipient.picture?.original?.url),
          } as any,
        },
      })
    }
  }, [recipient])

  return {
    _id,
    set_id,
    recipient,
    user,
    followers,
    toProfile,
    setToProfile,
  }
}

export default useGetPayData
