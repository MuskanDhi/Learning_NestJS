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
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { InventoryUsage } from 'src/inventory-items/entities/inventory-usage.entity';
import { LoginDto } from './dto/login.dto';

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

        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,

        @InjectRepository(InventoryItem)
        private readonly inventoryRepository: Repository<InventoryItem>,

        @InjectRepository(InventoryUsage)
        private readonly inventoryUsageRepository: Repository<InventoryUsage>,

        private jwtService: JwtService,
    ) { }

    // SEND OTP

    async login(body: LoginDto) {

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

    async verifyOtp(body: any) {
        const {
            phoneNumber,
            otp,
            appointmentId,
            action,
        } = body;

        if (!otp || otp !== '123456') {
            throw new BadRequestException(
                'Invalid OTP',
            );
        }

        // ==========================
        // START JOB / COMPLETE JOB
        // ==========================
        if (appointmentId && action) {

            const appointment =
                await this.appointmentRepository.findOne({
                    where: {
                        id: appointmentId,
                    },
                });

            if (!appointment) {
                throw new BadRequestException(
                    'Appointment not found',
                );
            }

            if (action === 'START_JOB') {

                if (
                    appointment.status !== 'BOOKED'
                ) {
                    throw new BadRequestException(
                        'Job cannot be started',
                    );
                }

                appointment.status =
                    'IN_PROGRESS';

                appointment.jobStartedAt =
                    new Date();

                await this.appointmentRepository.save(
                    appointment,
                );

                return {
                    success: true,
                    action: 'START_JOB',
                    message:
                        'OTP verified and job started successfully',
                    appointment,
                };
            }

            if (action === 'COMPLETE_JOB') {

                const { itemId, isFinished } = body;

                if (appointment.status !== 'IN_PROGRESS') {
                    throw new BadRequestException(
                        'Job has not started',
                    );
                }

                if (itemId) {

                    const item = await this.inventoryRepository.findOne({
                        where: {
                            id: itemId,
                        },
                    });

                    if (!item) {
                        throw new BadRequestException(
                            'Inventory item not found',
                        );
                    }

                    // ===============================
                    // Product NOT Finished
                    // ===============================
                    if (!isFinished) {

                        // Store usage history
                        const usage =
                            this.inventoryUsageRepository.create({
                                appointment,
                                item,
                                quantity: 1,
                            });

                        await this.inventoryUsageRepository.save(
                            usage,
                        );

                        // Increase Used Count
                        item.usedCount += 1;

                        await this.inventoryRepository.save(item);
                    }

                    // ===============================
                    // Product Finished
                    // ===============================
                    else {

                        if (item.stockLevel <= 0) {
                            throw new BadRequestException(
                                'Item is out of stock',
                            );
                        }

                        // Save usage history
                        const usage = this.inventoryUsageRepository.create({
                            appointment,
                            item,
                            quantity: 1,
                        });

                        await this.inventoryUsageRepository.save(usage);

                        item.usedCount = 0;

                        // Decrease Stock
                        item.stockLevel -= 1;

                        await this.inventoryRepository.save(item);
                    }

                    // Complete Appointment
                    appointment.status = 'COMPLETED';
                    appointment.jobCompletedAt = new Date();

                    await this.appointmentRepository.save(
                        appointment,
                    );

                    return {
                        success: true,
                        action: 'COMPLETE_JOB',
                        message:
                            'OTP verified and job completed successfully',
                        appointment,
                        inventory: {
                            itemId: item.id,
                            itemName: item.itemName,
                            usedCount: item.usedCount,
                            stockLevel: item.stockLevel,
                        },
                    };
                }

                // No Inventory Item
                appointment.status = 'COMPLETED';
                appointment.jobCompletedAt = new Date();

                await this.appointmentRepository.save(
                    appointment,
                );

                return {
                    success: true,
                    action: 'COMPLETE_JOB',
                    message:
                        'OTP verified and job completed successfully',
                    appointment,
                };
            }



            throw new BadRequestException(
                'Invalid action',
            );
        }

        if (!phoneNumber) {
            throw new BadRequestException(
                'Phone number required',
            );
        }

        // ==========================
        // CUSTOMER REGISTRATION
        // ==========================
        const registration =
            await this.registrationRepository.findOne({
                where: {
                    phoneNumber,
                },
            });

        if (registration) {

            const customer =
                this.customerRepository.create({
                    firstName:
                        registration.firstName,
                    lastName:
                        registration.lastName,
                    phoneNumber:
                        registration.phoneNumber,
                    branchId:
                        registration.branchId,
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

        // ==========================
        // LOGIN FLOW
        // ==========================
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

        // ==========================
        // PROFILE INCOMPLETE
        // ==========================
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
            message:
                'OTP verified successfully',

            access_token: token,

            user: {
                id: user.id,
                firstName:
                    user.firstName,
                lastName:
                    user.lastName,
                email:
                    user.email,
                phoneNumber:
                    user.phoneNumber,
                salons:
                    user.salons || [],
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
