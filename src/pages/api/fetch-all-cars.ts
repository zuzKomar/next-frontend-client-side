import { getToken } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  let tmpRespObject: any[] = [];
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  }

  await fetch(`https://rent-a-car-backend-f130520aafb5.herokuapp.com/cars`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      //Authorization: `Bearer ${token!.accessToken}`,
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoienV6YTFAd3AucGwiLCJpYXQiOjE3MDYwMTQ2MTUsImV4cCI6MTcwNjEwMTAxNX0.Wo4NUF4wfFmUwiotobnYOgO5xt2xPbCSmwrFZRuPUH8`,
    },
  })
    .then(res => res.json())
    .then(data => {
      tmpRespObject = [...data];
      return data;
    });

  return res.send({ status: 200, message: 'Hello from Next.js cars proxy', body: tmpRespObject });
}
