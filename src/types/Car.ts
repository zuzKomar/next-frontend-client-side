export type Car = {
  id: number;
  brand: string;
  model: string;
  productionYear: number;
  power: number;
  capacity: number;
  costPerDay: number;
  numberOfSeats?: number;
  transmission: string;
  photo?: string | null;
  usable: boolean;
  rents?: any[];
};
