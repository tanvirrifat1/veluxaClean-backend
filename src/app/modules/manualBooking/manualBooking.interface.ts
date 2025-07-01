export type IManualBooking = {
  serviceName: string;
  price: number;
  additionalServices: Record<string, number>;
  category: string;
  isDeleted?: boolean;
  name: string;
  email: string;
  time: string;
  date: Date;
};
