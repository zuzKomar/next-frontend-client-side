import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from './../Header';
import { Footer } from './../Footer';
import { Flex, View } from '@adobe/react-spectrum';
import style from './PageContainer.module.css'
import { useRouter } from "next/router";

type PageContainerProps = {
  children: any;
  checkAuthorized? : boolean
}

export const PageContainer = ({ children, checkAuthorized }: PageContainerProps): JSX.Element => {
  const [unauthorized, setUnauthorized] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(checkAuthorized && !data){
      setUnauthorized(true);
      router.push('http://localhost:3001/auth/signin');
    }
  }, [])

  return (
    <Flex direction="column" width="100%" height="100%" justifyContent='center' alignItems='center'>
      <Header />
      <div className={style.experiment}>
        <View paddingBottom="40px" minHeight="85vh" width="60%" UNSAFE_style={{'backgroundColor': 'rgba(0,0,0,0.7)'}}>
            <Flex direction="column" justifyContent="center" alignItems="center" flex="1 0 auto">
              {!unauthorized ? children : <h2>{"You're unauthorized!"}</h2>}
            </Flex>
          </View>
      </div>
      <Footer />
    </Flex>
  );
};
