import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/PageContainer/PageContainer';
import SelectedCarInfo from './components/selectedCarInfo';
import { useSession } from 'next-auth/react';
import IndexPage from '../components/IndexPage';
import { Car } from '../../types/Car';
import { useRouter } from 'next/router';

export default function CarPage() {
  const { data } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [carData, setCarData] = useState<Car>();
  let token = data?.user ? data?.user?.token : '';

  useEffect(() => {
    fetch(`${process.env.NEST_URL}/${id}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(res => setCarData(res));
  }, []);

  return (
    <PageContainer checkAuthorized={true}>
      <IndexPage />
      {carData && <SelectedCarInfo carData={carData} />}
    </PageContainer>
  );
}
