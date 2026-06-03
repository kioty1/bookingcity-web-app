import type { AuthUserState } from "./auth.types";
import type { Page } from "../enums/page.enums";

export type RentType = {
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
  setPage: (page: Page) => void;
  onViewDetails: (propertyId: number) => void;
};