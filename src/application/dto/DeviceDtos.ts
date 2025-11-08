export type DeviceRequest = {
  name: string;
  brand: string;
  state: string;
};

export type DeviceResponse = {
  id: string;
  name: string;
  brand: string;
  state: string;
  createdAt: string;
};

export type Response<T> = {
  data: Array<T>;
  total: number;
};
