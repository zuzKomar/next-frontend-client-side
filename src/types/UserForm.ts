export type IFormInputs = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  pesel?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type CarFiltersType = {
  brand: string | null;
  model: string | null;
  transmission: { id: number; name: string };
  productionYear: { start: number; end: number };
  power: { start: number; end: number };
  capacity: { start: number; end: number };
  numberOfSeats: { start: number; end: number };
  costPerDay: { start: number; end: number };
};
