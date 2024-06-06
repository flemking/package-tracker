export enum DeliveryStatus {
  OPEN = 'OPEN',
  PICKED_UP = 'PICKED-UP',
  IN_TRANSIT = 'IN-TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export interface Delivery {
  _id: string;
  delivery_id: string;
  package_id: string;
  pickup_time: Date;
  start_time: Date;
  end_time: Date;
  location: {
    lat: number;
    lng: number;
  };
  status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}
