import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './entities/services.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TeamMember } from 'src/team-members/entities/team-member.entity';
import { SubCategory } from 'src/sub-categories/entities/sub-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      Branch,
      TeamMember,
      SubCategory
    ]),
    AuthModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService]
})
export class ServicesModule { }
