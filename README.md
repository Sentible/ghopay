## Project Description ##
GhoPay is a protocol that allows signed-up users to decide what tokens their Lens or ENS handles get paid in. This allows their peers to send them any token without worrying about converting it. Cross-chain payments can be supported on most major EVMs. The main goal of GhoPay is to make it easier to handle payments in web3 when dealing with hex addresses. Instead, you can use the handles of addresses from popular protocols like Lens and ENS.
https://ghopay.xyz/

## How it's Made ##
We are using next.js, react, wagmi, and lens protocol for our website UI. In order to load certain payment profiles we will be using Lens Protocol. For cross-chain support, we will be using the Connext Network. Polybase will be used to store users' p2p transactions done through GhoPay, and as a way to also highlight certain accounts you want to pay from your lens profile quickly, Polygon and Optimism will be the demo cross-chain networks.


![image](https://github.com/KanteLabs/ghopay/assets/7266939/076aa32b-91ad-4c1a-8863-a11a0a1afe5f)

![image](https://github.com/KanteLabs/ghopay/assets/7266939/52c5d884-ea62-4e6c-897e-60a9c5c4882c)













##################################

This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](https://github.com/rainbow-me/rainbowkit/tree/main/packages/create-rainbowkit).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about this stack, take a look at the following resources:

- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.

You can check out [the RainbowKit GitHub repository](https://github.com/rainbow-me/rainbowkit) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
