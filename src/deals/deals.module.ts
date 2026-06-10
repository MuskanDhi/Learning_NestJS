import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './entities/deal.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Service } from 'src/services/entities/services.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Deal,
            Branch,
            Service,
        ]),
        AuthModule
    ],
    controllers: [DealsController],
    providers: [DealsService],
})
export class DealsModule {}
