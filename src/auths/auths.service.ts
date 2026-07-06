import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/email-users/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { MailService } from '../mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService,
    ) { }
    async signup(signupDto: SignupDto) {
        const { name, email } = signupDto;

        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new BadRequestException(
                'Email already registered',
            );
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();

        const user = this.userRepository.create({
            name,
            email,
            otp,
            isVerified: false,
        });

        await this.userRepository.save(user);

        await this.mailService.sendOtp(email, otp);

        return {
            message: 'OTP sent successfully',
        };
    }
    async verifyOtp(dto: VerifyOtpDto) {

        const { email, otp } = dto;

        const user = await this.userRepository.findOne({
            where: { email },
        });

        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }

        if (user.otp !== otp) {
            return {
                success: false,
                message: "Invalid OTP",
            };
        }

        user.isVerified = true;
        user.otp = "";

        await this.userRepository.save(user);

        return {
            success: true,
            message: "Email verified successfully",
        };
    }

    async login(loginDto: LoginDto) {

        const { email } = loginDto;

        const user = await this.userRepository.findOne({
            where: { email },
        });

        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }

        if (!user.isVerified) {
            return {
                success: false,
                message: "Please verify your email first",
            };
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;

        await this.userRepository.save(user);

        await this.mailService.sendOtp(email, otp);

        return {
            success: true,
            message: "OTP sent successfully",
        };
    }
}
