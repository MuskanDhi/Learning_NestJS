import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { Branch } from 'src/branches/entities/branch.entity';
import { Vendor } from './entities/vendor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, Branch]),AuthModule
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
