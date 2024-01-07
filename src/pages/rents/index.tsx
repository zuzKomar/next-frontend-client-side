import { PageContainer } from '../components/PageContainer/PageContainer';
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
  Button,
} from '@adobe/react-spectrum';
import { days } from '../cars/components/rentModal';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Rent } from '../../types/Rent';
import IndexPage from '../components/IndexPage';
import { useEffect, useState } from 'react';

export default function Rents() {
  const router = useRouter();
  const { data } = useSession();
  const [rents, setRents] = useState<Rent[]>([]);
  const token = data?.user!.token || '';

  useEffect(() => {
    if (data) {
      fetch(`${process.env.NEST_URL}/users/${data.user.email}`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => res.json())
        .then(res => setRents([...res]));
    }
  }, []);

  const columns = [
    { name: 'Car', uid: 'car' },
    { name: 'Date from', uid: 'date' },
    { name: 'Date to', uid: 'dueDate' },
    { name: 'Cost', uid: 'cost' },
    { name: 'Damaged', uid: 'damagedCar' },
    { name: 'Options', uid: 'reportDamage' },
  ];

  const modifiedRents =
    rents.length > 0
      ? rents.map(rent => ({
          ...rent,
          car: rent.car.brand + ' ' + rent.car.model,
          date: new Date(rent.date).toISOString().slice(0, 10),
          dueDate: new Date(rent.dueDate).toISOString().slice(0, 10),
          cost: days(new Date(rent.dueDate), new Date(rent.date)) * rent.car.costPerDay,
          damagedCar: rent.damagedCar === false ? 'No' : 'Yes',
          reportDamage: 'yes',
        }))
      : [];

  function handleDamageReport(rentId: number) {
    const updateRentDto = {
      damagedCar: true,
    };

    fetch(`${process.env.NEST_URL}/rents/${rentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateRentDto),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(() => router.push(`/rents`))
      .catch(e => console.log(e));
  }

  return (
    <PageContainer>
      <IndexPage />
      <h1>Your rents</h1>
      <TableView
        aria-label="Table with your rents"
        flex
        selectionMode="single"
        selectionStyle="highlight"
        alignSelf="center"
        width="100%"
        UNSAFE_className="cars-tablee"
      >
        <TableHeader columns={columns}>
          {column => (
            <Column key={column.uid} align="center">
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={modifiedRents}>
          {(item: any) => (
            <Row>
              {columnKey => (
                <Cell>
                  {columnKey !== 'reportDamage' ? (
                    item[columnKey]
                  ) : (
                    <Button
                      variant="primary"
                      isDisabled={item.damagedCar === 'No' ? false : true}
                      onPress={() => handleDamageReport(item.id)}
                    >
                      Report damage
                    </Button>
                  )}
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </TableView>
    </PageContainer>
  );
}
