import { useENS } from '@/hooks/useEns';
import AppHome from '@/modules/AppHome';
import { generateColorFromAddress } from '@/utils/utils';
import { AvatarComponent } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  // const { avatar } = useENS(address);
  const color = generateColorFromAddress(address);

  const image = ensImage;
  return image ? (
    <Image
      alt="Image"
      src={image ?? ''}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 999,
        height: size,
        width: size,
      }}
    >
    </div>
  );
};



const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>GhoPay</title>
        <meta
          content="GhoPay"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <AppHome />

      {/* <footer>
        <a href="https://sentible.xyz" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by Sentible
        </a>
      </footer> */}
    </div>
  );
};

export default Home;
