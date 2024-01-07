import { Footer as AdobeFooter } from '@adobe/react-spectrum';

export const Footer = () => {
  return (
    <AdobeFooter
      height="40px"
      UNSAFE_style={{
        backgroundColor: 'black',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
      width="100%"
      marginTop="-40px"
      justifySelf="center"
      alignSelf="center"
    >
      {'Copyright © 2023 The Midnight. All rights reserved.'}
    </AdobeFooter>
  );
};
