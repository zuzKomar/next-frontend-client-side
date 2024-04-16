'use client';
import { CarFiltersType } from '@/types/UserForm';
import { Button, ComboBox, Flex, Item, RangeSlider, TextField } from '@adobe/react-spectrum';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  brand: yup
    .string()
    .min(2)
    .max(30)
    .nullable()
    .transform(value => (value === '' ? null : value)),
  model: yup
    .string()
    .min(2)
    .max(30)
    .nullable()
    .transform(value => (value === '' ? null : value)),
  transmission: yup.object().shape({
    id: yup.number(),
    name: yup.string(),
  }),
  productionYear: yup.object().shape({
    start: yup.number().min(1970),
    end: yup.number().max(2024),
  }),
  power: yup.object().shape({
    start: yup.number().min(50),
    end: yup.number().max(800),
  }),
  capacity: yup.object().shape({
    start: yup.number().min(0),
    end: yup.number().max(10),
  }),
  numberOfSeats: yup.object().shape({
    start: yup.number().min(2),
    end: yup.number().max(7),
  }),
  costPerDay: yup.object().shape({
    start: yup.number().min(50),
    end: yup.number().max(1000),
  }),
});

type TableFiltersType = {
  filtersHanlder: (filtersData: CarFiltersType) => void;
  clearFiltersHandler: () => void;
};

const TableFilters = ({ filtersHanlder, clearFiltersHandler }: TableFiltersType) => {
  const {
    control,
    handleSubmit,
    formState: { isValid, defaultValues },
    getValues,
    reset,
  } = useForm<CarFiltersType>({
    resolver: yupResolver(schema),
    defaultValues: {
      brand: '',
      model: '',
      transmission: { id: 0, name: '' },
      productionYear: { start: 1970, end: 2024 },
      power: { start: 50, end: 800 },
      capacity: { start: 0, end: 10 },
      numberOfSeats: { start: 2, end: 7 },
      costPerDay: { start: 50, end: 1000 },
    },
  });

  const transmissionOptions = [
    { id: 0, name: '' },
    { id: 1, name: 'MANUAL' },
    { id: 2, name: 'AUTOMATIC' },
  ];

  const onSubmit: SubmitHandler<CarFiltersType> = async data => {
    if (isValid) {
      await filtersHanlder(data);
    }
  };

  const onCancel = async () => {
    reset(defaultValues);
    await clearFiltersHandler();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column">
        <Flex direction="row" gap="size-150" wrap marginBottom="10px">
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <TextField
                label="Brand:"
                value={field.value ? field.value : ''}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <TextField
                label="Model:"
                value={field.value ? field.value : ''}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="transmission"
            control={control}
            render={({ field }) => (
              <ComboBox
                label="Transmission type:"
                defaultItems={transmissionOptions}
                inputValue={field.value.name}
                onInputChange={field.onChange}
              >
                {item => <Item textValue={item.name}>{item.name}</Item>}
              </ComboBox>
            )}
          />
        </Flex>
        <Flex direction="row" gap="size-150" wrap>
          <Controller
            name="productionYear"
            control={control}
            render={({ field }) => (
              <RangeSlider
                label="Prod. year:"
                minValue={1970}
                maxValue={2023}
                value={field.value}
                onChange={field.onChange}
                formatOptions={{ style: 'decimal' }}
              />
            )}
          />
          <Controller
            name="power"
            control={control}
            render={({ field }) => (
              <RangeSlider
                label="Horsepower:"
                minValue={80}
                maxValue={800}
                value={field.value}
                onChange={field.onChange}
                formatOptions={{ style: 'decimal' }}
              />
            )}
          />
          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <RangeSlider
                label="Capacity:"
                minValue={0.0}
                maxValue={10.0}
                value={field.value}
                onChange={field.onChange}
                formatOptions={{ style: 'decimal' }}
              />
            )}
          />
        </Flex>
        <Flex direction="row" gap="size-150" wrap marginBottom="5px">
          <Controller
            name="numberOfSeats"
            control={control}
            render={({ field }) => (
              <RangeSlider
                label="Number of seats:"
                minValue={2}
                maxValue={7}
                value={field.value}
                onChange={field.onChange}
                formatOptions={{ style: 'decimal' }}
              />
            )}
          />
          <Controller
            name="costPerDay"
            control={control}
            render={({ field }) => (
              <RangeSlider
                label="Cost/day:"
                minValue={50}
                maxValue={1000}
                value={field.value}
                onChange={field.onChange}
                formatOptions={{ style: 'decimal' }}
              />
            )}
          />
          <Button
            type="submit"
            variant="primary"
            UNSAFE_style={{ cursor: 'pointer' }}
            onPress={() => onSubmit(getValues())}
          >
            Apply filters
          </Button>
          <Button
            type="button"
            variant="primary"
            UNSAFE_style={{ cursor: 'pointer' }}
            onPress={onCancel}
          >
            Clear filters
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default TableFilters;
