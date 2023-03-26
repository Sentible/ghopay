// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'

// const baseurl = 'https://goerli.api.0x.org/swap/v1/quote?buyToken=0x9FD21bE27A2B059a288229361E2fA632D8D2d074&sellToken=0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6&sellAmount=50000000000000000&slippagePercentage=0.05'
const baseurl = 'https://goerli.api.0x.org/swap/v1/quote'

const Headers = {
  'accept': 'application/json',
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { buyToken, sellToken, sellAmount } = req.query;

  console.log(buyToken, sellToken, sellAmount, req.query)

  const url = `${baseurl}?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&slippagePercentage=0.05`;

  try {
    const response = await (await fetch(url, { headers: Headers })).json();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send({});
  }
}
