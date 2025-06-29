export type IService = {
  serviceName: string;
  details: string;
  price: number;
  additionalServices: Record<string, number>;
  image: string;
  category: string;
};
