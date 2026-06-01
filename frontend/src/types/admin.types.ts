import { RentType } from "./rent.types";

export type AdminType = {
    id: number;
    name: string;
    email: string;
    role: string;
    properties: RentType[];
};