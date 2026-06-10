import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Branch
    ]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule { }
