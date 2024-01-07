import { Flex, Item, TabList, Tabs } from '@adobe/react-spectrum';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

export const Navbar = () => {
  const router = useRouter();
  let currentPath = router.pathname.split('/')[1];
  const { data: session } = useSession();
  return (
    <Flex justifyContent="center" direction="column">
      {session && <h2>{`Logged as ${session?.user.firstName + ' ' + session?.user.lastName}`}</h2>}
      <Flex direction="row" justifyContent="center">
        <Tabs aria-label="navigation" density="compact" selectedKey={currentPath}>
          <TabList>
            <Item key="">
              <Link href="/">Home</Link>
            </Item>
            <Item key="cars">
              <Link href="/cars">Cars</Link>
            </Item>
            <Item key="rents">
              <Link href="/rents">Rents</Link>
            </Item>
            <Item key="user">
              <Link href="/user">User</Link>
            </Item>
          </TabList>
        </Tabs>
        <>
          {session ? (
            <button onClick={() => signOut({ callbackUrl: 'http://localhost:3001/auth/signin' })}>
              Sign out
            </button>
          ) : (
            <button
              onClick={() => {
                router.push('/auth/signin');
              }}
            >
              Sign in
            </button>
          )}
        </>
      </Flex>
    </Flex>
  );
};
