import{
    IsNotEmpty
} from 'class-validator';

export class CreateSubCategoryDto {
    
    @IsNotEmpty()
    name: string;
}