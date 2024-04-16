import PageContainer from '../components/PageContainer/PageContainer';
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
  Button,
  Header,
} from '@adobe/react-spectrum';
import { days } from '../cars/components/rentModal';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Rent } from '../../types/Rent';
import IndexPage from '../components/IndexPage';
import { useEffect, useState } from 'react';

export default function Rents() {
  const router = useRouter();
  const [rents, setRents] = useState<Rent[]>([]);
  const [noRents, setNoRents] = useState<boolean>();

  const { data } = useSession();
  const token = data?.user!.token || '';

  const columns = [
    { name: 'Car', uid: 'car' },
    { name: 'Date from', uid: 'date' },
    { name: 'Date to', uid: 'dueDate' },
    { name: 'Cost', uid: 'cost' },
    { name: 'Damaged', uid: 'damagedCar' },
    { name: 'Options', uid: 'reportDamage' },
  ];

  useEffect(() => {
    if (data) {
      fetch(`/api/fetch-all-rents`, {
        mode: 'cors',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          setRents([...data.body]);
          setNoRents(data.body.length === 0);
        });
    }
  }, []);

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

    fetch(`/api/report-car-damage`, {
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
    <PageContainer checkAuthorized={true}>
      <IndexPage />
      <h1>Your rents</h1>
      {rents.length > 0 && !noRents && (
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
      )}
      {rents.length === 0 && noRents && <Header>No rents so far!</Header>}
    </PageContainer>
  );
}
