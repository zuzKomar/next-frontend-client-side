'use client';
import { useState, useEffect } from 'react';
import { AlertDialog, Button, Flex } from '@adobe/react-spectrum';
import { DatePicker } from '@adobe/react-spectrum';
import { parseDate } from '@internationalized/date';

type RentModalProps = {
  carId: number;
  userId: number;
  costPerDay: number;
  closeHandler: (open: boolean) => void;
  confirmHandler: (carId: number, userId: number, date: string, dueDate: string) => void;
  checkAvailabilityHandler: (carId: number, date: string, dueDate: string) => boolean;
};

export const days = (date_1: Date, date_2: Date) => {
  const difference = date_1.getTime() - date_2.getTime();
  const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return totalDays;
};

const RentModal = ({
  carId,
  userId,
  costPerDay,
  closeHandler,
  confirmHandler,
  checkAvailabilityHandler,
}: RentModalProps) => {
  const [date, setDate] = useState<string | any>(parseDate(new Date().toISOString().split('T')[0]));
  const [dueDate, setDueDate] = useState<string | any>(
    parseDate(new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0]),
  );
  const [disableRent, setDisableRent] = useState(true);
  const [carAvailable, setCarAvailable] = useState(true);

  useEffect(() => {
    setDisableRent(true);
    setCarAvailable(true);
  }, [date, dueDate]);

  const costOfRent = costPerDay * days(new Date(dueDate), new Date(date));

  return (
    <AlertDialog
      title="Pick rent time"
      primaryActionLabel="Rent"
      cancelLabel="Cancel"
      variant="confirmation"
      isPrimaryActionDisabled={disableRent}
      onCancel={() => closeHandler(false)}
      onPrimaryAction={() => confirmHandler(carId, userId, date, dueDate)}
    >
      Select suitable dates for rental period. Then check car availability. Note that the minimal
      rent time is one full day (24h). Rent starts at 8 am and ends at 8 am next day.
      <Flex direction="row" gap="size-200">
        <DatePicker label="Date from:" value={date} onChange={setDate} />
        <DatePicker label="Date to:" value={dueDate} onChange={setDueDate} />
      </Flex>
      <Flex direction="column">
        <Flex direction="row" justifyContent="space-around">
          {costOfRent > 0 && (
            <Flex direction="row" gap="size-100">
              <p>Cost of rent:</p>
              <p>{costOfRent + ' $'}</p>
            </Flex>
          )}
          <Button
            variant="accent"
            marginTop="10px"
            onPress={() => {
              setDisableRent(checkAvailabilityHandler(carId, date, dueDate));
              setCarAvailable(!checkAvailabilityHandler(carId, date, dueDate));
            }}
          >
            Check availability
          </Button>
        </Flex>
        {!carAvailable && (
          <p>Sorry, this car is not available in this time, please choose another slot.</p>
        )}
      </Flex>
    </AlertDialog>
  );
};

export default RentModal;
