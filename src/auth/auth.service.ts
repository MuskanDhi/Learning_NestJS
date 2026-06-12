import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Registration } from 'src/customers/entities/registraion.entity';

@Injectable()
export class AuthService {
    RegistrationRepository: any;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,

        @InjectRepository(Registration)
        private registrationRepository: Repository<Registration>,

        private jwtService: JwtService,
    ) { }

    // SEND OTP

    async login(body: any) {

        const { phoneNumber } = body;

        if (!phoneNumber) {
            throw new BadRequestException(
                'Phone number required',
            );
        }

        return {
            success: true,
            message: 'OTP sent successfully',
            otp: '123456',
        };
    }

    async register(
        branchId: string,
        body: any,
    ) {
        const {
            firstName,
            lastName,
            phoneNumber,
        } = body;

        const existingCustomer =
            await this.customerRepository.findOne({
                where: { phoneNumber },
            });

        if (existingCustomer) {
            throw new BadRequestException(
                'Customer already exists',
            );
        }

        await this.registrationRepository.save({
            firstName,
            lastName,
            phoneNumber,
            branchId,
            otp: '123456',
        });

        return {
            success: true,
            message: 'OTP sent successfully',
            otp: '123456',
        };
    }

    // VERIFY OTP

    // async verifyOtp(body: any) {

    //     const {
    //         phoneNumber,
    //         otp,
    //     } = body;

    //     if (!phoneNumber) {
    //         throw new BadRequestException(
    //             'Phone number required',
    //         );
    //     }

    //     if (otp !== '123456') {
    //         throw new BadRequestException(
    //             'Invalid OTP',
    //         );
    //     }

    //     let user =
    //         await this.userRepository.findOne({
    //             where: {
    //                 phoneNumber,
    //             },
    //             relations: {
    //                 salons: true,
    //             },
    //         });

    //     // USER NOT FOUND

    //     if (!user) {

    //         user =
    //             this.userRepository.create({
    //                 phoneNumber,
    //             });

    //         await this.userRepository.save(
    //             user,
    //         );

    //         return {
    //             success: false,
    //             message: 'Complete signup',
    //             userId: user.id,
    //         };
    //     }

    //     // PROFILE INCOMPLETE

    //     if (
    //         !user.firstName ||
    //         !user.lastName ||
    //         !user.email
    //     ) {
    //         return {
    //             success: false,
    //             message: 'Complete signup',
    //             userId: user.id,
    //         };
    //     }

    //     const token =
    //         this.jwtService.sign({
    //             id: user.id,
    //         });

    //     return {
    //         success: true,
    //         message: 'OTP verified successfully',

    //         access_token: token,

    //         user: {
    //             id: user.id,
    //             firstName: user.firstName,
    //             lastName: user.lastName,
    //             email: user.email,
    //             phoneNumber: user.phoneNumber,
    //             salons: user.salons || [],
    //         },
    //     };
    // }

    async verifyOtp(body: any) {
        const {
            phoneNumber,
            otp,
        } = body;

        if (otp !== '123456') {
            throw new BadRequestException(
                'Invalid OTP',
            );
        }

        if (!phoneNumber) {
            throw new BadRequestException(
                'Phone number required',
            );
        }

        // CHECK REGISTRATION

        const registration =
            await this.registrationRepository.findOne({
                where: {
                    phoneNumber,
                },
            });

        if (registration) {

            const customer =
                this.customerRepository.create({
                    firstName: registration.firstName,
                    lastName: registration.lastName,
                    phoneNumber: registration.phoneNumber,
                    branchId: registration.branchId,
                });

            await this.customerRepository.save(
                customer,
            );

            await this.registrationRepository.delete({
                id: registration.id,
            });

            return {
                success: true,
                type: 'register',
                message:
                    'Customer registered successfully',
                customer,
            };
        }

        // LOGIN FLOW

        let user =
            await this.userRepository.findOne({
                where: {
                    phoneNumber,
                },
                relations: {
                    salons: true,
                },
            });

        if (!user) {

            user =
                this.userRepository.create({
                    phoneNumber,
                });

            await this.userRepository.save(
                user,
            );

            return {
                success: false,
                message: 'Complete signup',
                userId: user.id,
            };
        }

        // PROFILE INCOMPLETE

        if (
            !user.firstName ||
            !user.lastName ||
            !user.email
        ) {
            return {
                success: false,
                message: 'Complete signup',
                userId: user.id,
            };
        }

        const token =
            this.jwtService.sign({
                id: user.id,
            });

        return {
            success: true,
            message: 'OTP verified successfully',

            access_token: token,

            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                salons: user.salons || [],
            },
        };
    }
    // COMPLETE SIGNUP

    async signup(
        userId: string,
        body: any,
    ) {

        const {
            firstName,
            lastName,
            email,
        } = body;

        const user =
            await this.userRepository.findOne({
                where: {
                    id: userId,
                },
                relations: {
                    salons: true,
                },
            });

        if (!user) {
            throw new BadRequestException(
                'User not found',
            );
        }

        const existingEmail =
            await this.userRepository.findOne({
                where: {
                    email,
                },
            });

        if (
            existingEmail &&
            existingEmail.id !== user.id
        ) {
            throw new BadRequestException(
                'Email already exists',
            );
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        await this.userRepository.save(
            user,
        );

        const token =
            this.jwtService.sign({
                id: user.id,
            });

        return {
            success: true,
            message: 'Signup successful',

            access_token: token,

            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                salons: user.salons || [],
            },
        };
    }
}
