import type { RentType } from "./rent.types";

export type BookingType = {
  id: number;
  userId: number;
  propertyId: number;
  startDate: string;
  endDate: string;
  status: string;
  property: RentType;
};