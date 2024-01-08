import { Flex, TextField, View } from '@adobe/react-spectrum';
import React, { useState, useEffect } from 'react';
import { Car as CarType } from '../../../types/Car';
import Car from '@spectrum-icons/workflow/Car';
import { Button } from '@adobe/react-spectrum';
import { Text } from '@adobe/react-spectrum';
import RentModal from './rentModal';
import { DialogTrigger } from '@adobe/react-spectrum';
import { useSession } from 'next-auth/react';

type SelectedCarInfoProps = {
  carData: CarType;
};

const SelectedCarInfo = ({ carData }: SelectedCarInfoProps) => {
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState(carData);
  const photoPath = `../../../public/static/${carData ? carData.photo : ''}.png`;

  const { data } = useSession();
  const userId = data ? data?.user?.id : '';
  const token = data?.user ? data.user.token : '';
  //const nextCarRents = car?.rents.length > 0 ? car.rents : []; //filter all rents that are gonna be in the future, pass it to modals
  //TODO: car details fetch to be added
  function handleCarRental(carId: number, userId: number, date: any, dueDate: any) {
    //check if this car is available this time
    //fetch post -> create new rent
    const createRentDto = {
      userId,
      carId,
      date:
        date.year +
        '-' +
        (date.month.toString().length === 1 ? '0' : '') +
        date.month +
        '-' +
        (date.day.toString().length === 1 ? '0' : '') +
        date.day +
        'T08:00:00.000Z',
      dueDate:
        dueDate.year +
        '-' +
        (dueDate.month.toString().length === 1 ? '0' : '') +
        dueDate.month +
        '-' +
        (dueDate.day.toString().length === 1 ? '0' : '') +
        dueDate.day +
        'T08:00:00.000Z',
    };

    fetch(`${process.env.NEST_URL}/rents`, {
      method: 'POST',
      body: JSON.stringify(createRentDto),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(e => console.log(e));
  }

  function handleCarAvailabilityCheck(carId: number, date: any, dueDate: any) {
    setOpen(true);
    const dateFrom =
      '' +
      date.year +
      '-' +
      (date.month.toString().length === 1 ? '0' + date.month : date.month) +
      '-' +
      (date.day.toString().length === 1 ? '0' + date.day : date.day) +
      'T08:00:00.000Z';
    const dateTo =
      '' +
      dueDate.year +
      '-' +
      (dueDate.month.toString().length === 1 ? '0' + dueDate.month : dueDate.month) +
      '-' +
      (dueDate.day.toString().length === 1 ? '0' + dueDate.day : dueDate.day) +
      'T08:00:00.000Z';
    //check if there are any rents in selected dates
    let isBooked = false;

    if (carData.rents)
      for (const rent of carData.rents) {
        if (
          (new Date(dateFrom) >= new Date(rent.date) &&
            new Date(dateFrom) <= new Date(rent.dueDate)) ||
          (new Date(dateTo) >= new Date(rent.date) && new Date(dateTo) <= new Date(rent.dueDate)) ||
          (new Date(dateFrom) <= new Date(rent.date) && new Date(dateTo) >= new Date(rent.date))
        ) {
          console.log('konflikt dat');
          isBooked = true;
        } else {
          console.log('brak konfliktu');
        }
      }
    return isBooked;
  }

  return (
    <View UNSAFE_style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} width="70%">
      <Flex direction="row" justifyContent="space-evenly">
        <Flex direction="column" gap="size-150" wrap>
          <TextField label="Brand" defaultValue={car ? car.brand : ''} isDisabled={true} />
          <TextField label="Model" defaultValue={car ? car.model : ''} isDisabled={true} />
          <TextField
            label="Production year"
            defaultValue={car ? car.productionYear.toString() : ''}
            isDisabled={true}
          />
          <TextField
            label="Power"
            defaultValue={car ? car.power.toString() : ''}
            isDisabled={true}
          />
          <TextField label="Capacity" defaultValue={car.capacity.toString()} isDisabled={true} />
          <TextField
            label="Number of seats"
            defaultValue={car.numberOfSeats ? car.numberOfSeats.toString() : ''}
            isDisabled={true}
          />
          <TextField
            label="Transmission"
            defaultValue={car ? car.transmission : ''}
            isDisabled={true}
          />
          <TextField
            label="Cost of rent per day"
            defaultValue={car ? car.costPerDay.toString() : ''}
            isDisabled={true}
          />
        </Flex>
        <Flex direction="column" marginTop="20px">
          <img src={photoPath} alt="car photo" width="240px" />
          <DialogTrigger type="modal">
            <Button variant="primary" marginTop="20px" onPress={() => setOpen(true)}>
              <Car />
              <Text>Rent me!</Text>
            </Button>
            <RentModal
              carId={car ? carData.id : 0}
              userId={userId || 1}
              costPerDay={car ? carData.costPerDay : 0}
              closeHandler={setOpen}
              confirmHandler={handleCarRental}
              checkAvailabilityHandler={handleCarAvailabilityCheck}
            />
          </DialogTrigger>
        </Flex>
      </Flex>
    </View>
  );
};

export default SelectedCarInfo;
