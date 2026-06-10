import { Module } from '@nestjs/common';
import { SalonsController } from './salons.controller';
import { SalonsService } from './salons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salon } from './entities/salon.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([
      Salon,
      Branch,
      User,
    ]),
    AuthModule,
  ],
  controllers: [SalonsController],
  providers: [SalonsService],
  exports: [SalonsService],
})
export class SalonsModule {}
