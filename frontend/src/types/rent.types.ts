import type { AuthUserState } from "./auth.types";

export type PropertyType = {
  id: number;
  ownerId: number;
  title: string;
  city: string;
  address: string | null;
  type: string;
  description: string | null;
  price: string;
  status: string;
  images?: {
    id: number;
    propertyId: number;
    url: string;
  }[];
};

export type RentPageProps = {
  authUser: AuthUserState;
};