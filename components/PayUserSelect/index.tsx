import dynamic from 'next/dynamic';
import { MiniProfile } from '../ProfileCard';
import { useState, useMemo, useEffect } from 'react';
import useGetPayData from '@/hooks/useGetPayData';

const LensSearch = dynamic(() => import('@/components/Inputs/Search'), { ssr: false });
const POPULAR_LENS = [
  'vitalik.lens',
  'aavegrants.lens',
  'stani.lens',
  'dabit3.lens',
];
const PayUserSelect = ({
  setValue
}: {
  setValue: (value: string | null) => void
}) => {
  const { followers } = useGetPayData()
  const [search, setSearch] = useState('')

  const noFollowers = followers.length === 0

  const filterOptions = useMemo(() => {
    if (!search?.length) return followers
    return followers.filter(({ handle }) => handle.match(search))
  }, [search, followers])

  useEffect(() => {
    setValue(search)
  }, [search])

  return (
    <LensSearch onClick={setSearch} onChange={setSearch} title='Profiles You Follow' placeholder="vitalik.eth, stani.lens, ...0xb.." value={search}>
      {!!filterOptions?.length ? (
        <>
          <h3>Profiles You Follow</h3>
          <div className="lens-options">
            {filterOptions.map(({
              ownedBy,
              name,
              handle,
              picture,
            }) => (
              <MiniProfile address={ownedBy} key={ownedBy} label={name} image={picture?.original?.url} onClick={() => {
                setSearch(handle)
              }} size={55} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h3>{noFollowers ? (search?.length ? '' : 'Popular Users') : 'No Match found'}</h3>
          <div className="lens-options">
            {search || (POPULAR_LENS.map(p => (
              <p onClick={() => setValue(p)} key={p}>{p}</p>
            )))}
          </div>
        </>
      )
      }
    </LensSearch>
  )

}

export default PayUserSelect
