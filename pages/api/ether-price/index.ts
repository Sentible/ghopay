// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'

const url = 'https://sentible.app/api/v1/ether-price'

const Headers = {
  'accept': 'application/json',
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const response = await (await fetch(url, { headers: Headers })).json();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send({});
  }
}
