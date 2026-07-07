import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Customer } from 'src/customers/entities/customer.entity';
import { Registration } from 'src/customers/entities/registraion.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { InventoryUsage } from 'src/inventory-items/entities/inventory-usage.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User, Customer, Registration, Appointment, InventoryItem, InventoryUsage]),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  exports: [JwtModule],

  controllers: [AuthController],

  providers: [AuthService],
})
export class AuthModule { }