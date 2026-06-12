import { IsNumber } from "class-validator";

export class LocationDTO{

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;
}