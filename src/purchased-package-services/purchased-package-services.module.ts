import { Module } from '@nestjs/common';
import { PurchasedPackageServicesService } from './purchased-package-services.service';
import { PurchasedPackageServicesController } from './purchased-package-services.controller';
import { PurchasedPackageService } from './entities/purchased-package-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedPackage } from 'src/purchased-packages/entities/purchased-package.entity';
import { TeamMember } from 'src/team-members/entities/team-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchasedPackageService,
      PurchasedPackage,
      TeamMember,
    ]),
  ],
  controllers: [PurchasedPackageServicesController],
  providers: [PurchasedPackageServicesService],
  exports: [PurchasedPackageServicesService],
})
export class PurchasedPackageServicesModule {}
