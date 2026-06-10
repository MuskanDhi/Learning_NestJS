// import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { CreateSalonBranchDto } from './dto/create-salon-branch.dto';
// import { SalonBranchService } from './salon-branch.service';

// @Controller('salon-branch')
// export class SalonBranchController {
//     constructor(
//         private salonBranchService: SalonBranchService,
//     ) { }

//     @UseGuards(JwtAuthGuard)
//     @Post()
//     createSalonAndBranch(
//         @Body() dto: CreateSalonBranchDto,
//         @Req() req,
//     ) {
//         return this.salonBranchService.createSalonAndBranch(
//             dto,
//             req.user.id,
//         );
//     }
// }
