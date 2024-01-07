import Head from 'next/head';
import Script from 'next/script';

function IndexPage() {
  return (
    <div>
      <Head>
        <title>The Midnight! Rent a car</title>
      </Head>
      <Script type="text/javascript" src="https://unpkg.com/default-passive-events" />
    </div>
  );
}

export default IndexPage;
