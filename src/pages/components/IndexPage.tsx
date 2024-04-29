'use client';
import Script from 'next/script';

function IndexPage() {
  return (
    <div>
      <head>
        <base href="/" />
        <title>The Midnight! Rent a car</title>
      </head>
      <Script type="text/javascript" src="https://unpkg.com/default-passive-events" defer />
    </div>
  );
}

export default IndexPage;
