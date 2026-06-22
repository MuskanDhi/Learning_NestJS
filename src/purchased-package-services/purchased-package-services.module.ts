import { Module } from '@nestjs/common';
import { PurchasedPackageServicesService } from './purchased-package-services.service';
import { PurchasedPackageServicesController } from './purchased-package-services.controller';
import { PurchasedPackageService } from './entities/purchased-package-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedPackage } from 'src/purchased-packages/entities/purchased-package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchasedPackageService,
      PurchasedPackage
    ]),
  ],
  controllers: [PurchasedPackageServicesController],
  providers: [PurchasedPackageServicesService],
  exports: [PurchasedPackageServicesService],
})
export class PurchasedPackageServicesModule {}
