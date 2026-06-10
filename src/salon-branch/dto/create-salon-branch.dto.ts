import { IsNotEmpty } from 'class-validator';
export class CreateSalonBranchDto {
    salonId?: string;

    // SALON DATA
    salonName?: string;
    ownerName?: string;
    ownerPhoneNumber?: string;

    // BRANCH DATA
    @IsNotEmpty()
    branchName: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    openingTime: string;

    @IsNotEmpty()
    closingTime: string;

    @IsNotEmpty()
    flatNumber: string;

    @IsNotEmpty()
    street: string;

    @IsNotEmpty()
    area: string;

    @IsNotEmpty()
    pincode: string;

    aboutUs?: string;
}