export interface Package {
  _id: string;
  package_id: string;
  active_delivery_id: string;
  description: string;
  weight: number;
  height: number;
  depth: number;
  from_name: string;
  from_address: string;
  from_location: {
    lat: number;
    lng: number;
  };
  to_name: string;
  to_address: string;
  to_location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}
