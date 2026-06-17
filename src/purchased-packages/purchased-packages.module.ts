import { Module } from '@nestjs/common';
import { PurchasedPackagesService } from './purchased-packages.service';
import { PurchasedPackagesController } from './purchased-packages.controller';
import { PurchasedPackage } from './entities/purchased-package.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Package } from 'src/packages/entities/package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedPackageService } from 'src/purchased-package-services/entities/purchased-package-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchasedPackage,
      PurchasedPackageService,
      Package,
      Branch,
    ]),
  ],
  controllers: [PurchasedPackagesController],
  providers: [PurchasedPackagesService],
  exports: [PurchasedPackagesService],
})
export class PurchasedPackagesModule { }
