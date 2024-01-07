import { Car } from "./Car";

export type Rent = {
  id: number;
  userId: number;
  carId: number;
  date: Date;
  dueDate: Date;
  damagedCar: boolean;
  car: Car;
};
