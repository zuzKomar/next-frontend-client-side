'use client';
import dynamic from 'next/dynamic';
import { Car } from '../../types/Car';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
const PageContainer = dynamic(() => import('../components/PageContainer/PageContainer'), {
  ssr: false,
});
const SelectedCarInfo = dynamic(() => import('./components/selectedCarInfo'), { ssr: false });
const IndexPage = dynamic(() => import('../components/IndexPage'), { ssr: false });

export default function CarPage() {
  const { data } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [carData, setCarData] = useState<Car>();
  const token = data?.user ? data?.user?.token : '';

  useEffect(() => {
    fetch(`/api/fetch-selected-car`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ carId: id }),
    })
      .then(res => res.json())
      .then(res => setCarData(res.body));
  }, []);

  return (
    <PageContainer checkAuthorized={true}>
      <IndexPage />
      {carData && <SelectedCarInfo carData={carData} />}
    </PageContainer>
  );
}
