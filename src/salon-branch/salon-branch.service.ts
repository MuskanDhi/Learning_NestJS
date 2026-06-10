// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { CreateSalonBranchDto } from './dto/create-salon-branch.dto';
// import { Repository } from 'typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { Branch } from 'src/branches/entities/branch.entity';
// import { Salon } from 'src/salons/entities/salon.entity';
// import { InjectRepository } from '@nestjs/typeorm';

// @Injectable()
// export class SalonBranchService {
//     constructor(
//         @InjectRepository(Salon)
//         private salonRepository: Repository<Salon>,

//         @InjectRepository(User)
//         private userRepository: Repository<User>,

//         @InjectRepository(Branch)
//         private branchRepo: Repository<Branch>,
//     ) { }
//     async createSalonAndBranch(
//         dto: CreateSalonBranchDto,
//         userId: string,
//     ) {

//         // FIND USER
//         const user = await this.userRepository.findOne({
//             where: { id: userId },
//         });

//         if (!user) {
//             throw new NotFoundException('User not found');
//         }

//         let salon;

//         // IF SALON ID EXISTS

//         if (dto.salonId) {

//             salon = await this.salonRepository.findOne({
//                 where: {
//                     id: dto.salonId,
//                 },
//                 relations: {
//                     user: true,
//                 },
//             });

//             if (!salon) {
//                 throw new NotFoundException('Salon not found');
//             }

//             // SECURITY CHECK

//             if (salon.user.id !== userId) {
//                 throw new BadRequestException(
//                     'This salon does not belong to you',
//                 );
//             }

//         } else {

//             // CHECK SALON PHONE NUMBER

//             const existingSalon =
//                 await this.salonRepository.findOne({
//                     where: {
//                         ownerPhoneNumber:
//                             dto.ownerPhoneNumber,
//                     },
//                 });

//             if (existingSalon) {
//                 throw new BadRequestException(
//                     'Salon phone number already exists',
//                 );
//             }

//             // CREATE NEW SALON

//             salon = this.salonRepository.create({
//                 salonName: dto.salonName,
//                 ownerName: dto.ownerName,
//                 ownerPhoneNumber:
//                     dto.ownerPhoneNumber,
//                 user,
//             });

//             salon = await this.salonRepository.save(salon);
//         }

//         // CHECK BRANCH PHONE NUMBER

//         const existingBranch =
//             await this.branchRepo.findOne({
//                 where: {
//                     phoneNumber:
//                         dto.phoneNumber,
//                 },
//             });

//         if (existingBranch) {
//             throw new BadRequestException(
//                 'Branch phone number already exists',
//             );
//         }

//         // CREATE BRANCH

//         const branch = this.branchRepo.create({
//             branchName: dto.branchName,
//             phoneNumber: dto.phoneNumber,
//             openingTime: dto.openingTime,
//             closingTime: dto.closingTime,
//             flatNumber: dto.flatNumber,
//             street: dto.street,
//             area: dto.area,
//             pincode: dto.pincode,
//             aboutUs: dto.aboutUs,
//             salon,
//         });

//         await this.branchRepo.save(branch);

//         return {
//             message: dto.salonId
//                 ? 'Branch created successfully'
//                 : 'Salon and Branch created successfully',

//             salon,
//             branch,
//         };
//     }
// }
