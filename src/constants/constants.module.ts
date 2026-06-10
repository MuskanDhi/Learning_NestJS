import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Specialty } from 'src/specialties/entities/specialty.entity';
import { ConstantsController } from './constants.controller';
import { ConstantsService } from './constants.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Role,
            Specialty,
        ])
    ],
    controllers: [ConstantsController],
    providers: [ConstantsService],
})
export class ConstantModule { }
