import {
  View,
  Button,
  Flex,
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Header,
} from '@adobe/react-spectrum';
import PageContainer from '../components/PageContainer/PageContainer';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import TableFilters from './components/tableFilters';
import { Car } from '../../types/Car';
import IndexPage from '../components/IndexPage';
import { CarFiltersType } from '@/types/UserForm';

export default function Cars() {
  const router = useRouter();
  const [showTableFilters, setShowTableFilters] = useState(false);
  const [carData, setCarData] = useState<Car[]>([]);
  const [noCars, setNoCars] = useState<boolean>();

  const { data } = useSession();
  const token = data?.user ? data.user?.token : '';

  const columns = [
    { name: 'Brand', uid: 'brand' },
    { name: 'Model', uid: 'model' },
    { name: 'Prod. year', uid: 'productionYear' },
    { name: 'Power', uid: 'power' },
    { name: 'Capacity', uid: 'capacity' },
    { name: 'Cost/day', uid: 'costPerDay' },
  ];

  useEffect(() => {
    if (data) {
      fetch(`/api/fetch-all-cars`, {
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
          setCarData([...data.body]);
          setNoCars(data.body.length === 0);
        });
    }
  }, []);

  async function fetchFilteredData(filtersData: CarFiltersType) {
    let newUrl = '?';

    if (filtersData.brand && filtersData.brand.length > 0) {
      newUrl += 'brand=' + filtersData.brand + '&';
    }
    if (filtersData.model && filtersData.model.length > 0) {
      newUrl += 'model=' + filtersData.model + '&';
    }
    if (filtersData.transmission.name.length > 0) {
      newUrl += 'transmission=' + filtersData.transmission.name + '&';
    }
    if (filtersData.productionYear.start > 1970) {
      newUrl += 'productionYearFrom=' + filtersData.productionYear.start + '&';
    }
    if (filtersData.productionYear.end < 2023) {
      newUrl += 'productionYearTo=' + filtersData.productionYear.end + '&';
    }
    if (filtersData.power.start > 80) {
      newUrl += 'powerFrom=' + filtersData.power.start + '&';
    }
    if (filtersData.power.end < 800) {
      newUrl += 'powerTo=' + filtersData.power.end + '&';
    }
    if (filtersData.capacity.start > 0) {
      newUrl += 'capacityFrom=' + filtersData.capacity.start + '&';
    }
    if (filtersData.capacity.end < 10) {
      newUrl += 'capacityTo=' + filtersData.capacity.end + '&';
    }
    if (filtersData.costPerDay.start > 50) {
      newUrl += 'costPerDayFrom=' + filtersData.costPerDay.start + '&';
    }
    if (filtersData.costPerDay.end < 1000) {
      newUrl += 'costPerDayTo=' + filtersData.costPerDay.end + '&';
    }
    if (filtersData.numberOfSeats.start > 2) {
      newUrl += 'numberOfSeatsFrom=' + filtersData.numberOfSeats.start + '&';
    }
    if (filtersData.numberOfSeats.end < 7) {
      newUrl += 'numberOfSeatsTo=' + filtersData.numberOfSeats.end + '&';
    }

    const url = new URL(window.location.href);
    const pathname = url.pathname.slice(1) + newUrl.slice(0, -1);

    if (pathname.length > 5) {
      await fetch(`/api/filter-cars`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ pathname: pathname }),
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log(data);
          setCarData([...data.body]);
          setNoCars(data.body.length === 0);

          window.history.pushState({}, '', url.toString());
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  async function clearFiltersHandler() {
    await fetch(`/api/fetch-all-cars`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data?.user.token,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setCarData([...data.body]);
        setNoCars(data.body.length === 0);
      })
      .catch(err => {
        console.log(err);
      });
  }

  function selectCarHandler(keys: any) {
    router.push(`/cars/${keys.currentKey}`);
  }

  return (
    <PageContainer checkAuthorized={true}>
      <IndexPage />
      <h1>Available cars:</h1>
      <Flex direction="row" marginBottom="5px">
        <Button
          variant="primary"
          UNSAFE_style={{ cursor: 'pointer' }}
          onPress={e => setShowTableFilters(!showTableFilters)}
        >
          {showTableFilters === false ? 'Show filters' : 'Hide filters'}
        </Button>
      </Flex>
      {showTableFilters && (
        <View UNSAFE_style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TableFilters
            filtersHanlder={fetchFilteredData}
            clearFiltersHandler={clearFiltersHandler}
          />
        </View>
      )}
      {carData.length > 0 && !noCars && (
        <TableView
          aria-label="Table with car available for rent"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="100%"
          onSelectionChange={keys => selectCarHandler(keys)}
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={carData}>
            {(item: any) => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
          </TableBody>
        </TableView>
      )}
      {carData.length === 0 && noCars && <Header>No cars available!</Header>}
    </PageContainer>
  );
}
