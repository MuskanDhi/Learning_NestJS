import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateVendorDto {
    
    @IsNotEmpty()
    vendorName: string;

    @IsNotEmpty()
    vendorPhone: string;

    @IsNotEmpty()
    @IsEmail()
    vendorEmail: string;

}
