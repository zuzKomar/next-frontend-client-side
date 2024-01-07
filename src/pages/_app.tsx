import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, darkTheme, SSRProvider } from '@adobe/react-spectrum';
import { SessionProvider } from "next-auth/react";
import { Session } from 'next-auth';
import { useState } from 'react';
import tgwf from '@tgwf/co2';

function MyApp({ 
  Component, 
  pageProps: {session, ...pageProps},
 }: AppProps<{session: Session}>) {
  const [interval, setInterval] = useState(0);

  let co2emission = new tgwf.co2();
  const bytesSent = 1000 * 1000 * 1000; // 1GB expressed in bytes
  const greenHost = true; // Is the data transferred from a green host?

  let result = co2emission.perByte(bytesSent, greenHost);

  console.log(
    `Sending a gigabyte, had a carbon footprint of ${result.toFixed(
      3
    )} grams of CO2`
  );

  return (
      <SessionProvider session={session} refetchInterval={interval}>
        <SSRProvider>
          <Provider theme={darkTheme}>
            <Component {...pageProps} />
          </Provider>
        </SSRProvider>
      </SessionProvider>
  );
}

export default MyApp;