// import { Module } from '@nestjs/common';
// import { SalonBranchController } from './salon-branch.controller';
// import { SalonBranchService } from './salon-branch.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Salon } from 'src/salons/entities/salon.entity';
// import { Branch } from 'src/branches/entities/branch.entity';
// import { User } from 'src/users/entities/user.entity';
// import { AuthModule } from 'src/auth/auth.module';
// import { SalonsModule } from 'src/salons/salons.module';

// @Module({
//       imports: [
//       TypeOrmModule.forFeature([
//         Salon,
//         Branch,
//         User,
//       ]),
//       AuthModule,
//       SalonsModule,
//     ],
//   controllers: [SalonBranchController],
//   providers: [SalonBranchService]
// })
// export class SalonBranchModule {}
