import { Module } from '@nestjs/common';
import { PurchasedPackageServicesService } from './purchased-package-services.service';
import { PurchasedPackageServicesController } from './purchased-package-services.controller';
import { PurchasedPackageService } from './entities/purchased-package-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchasedPackageService,
    ]),
  ],
  controllers: [PurchasedPackageServicesController],
  providers: [PurchasedPackageServicesService],
  exports: [PurchasedPackageServicesService],
})
export class PurchasedPackageServicesModule {}
