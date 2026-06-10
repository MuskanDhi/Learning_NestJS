import { Test, TestingModule } from '@nestjs/testing';
import { TeamMembersService } from './team-members.service';

describe('TeamMembersService', () => {
  let service: TeamMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamMembersService],
    }).compile();

    service = module.get<TeamMembersService>(TeamMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { IsNotEmpty } from 'class-validator';

export class CreateTeamMemberDto {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    joiningDate: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    aboutMember: string;

    @IsNotEmpty()
    branchId: string;

    @IsNotEmpty()
    serviceId: string;   // 👈 THIS IS ROLE NOW
}

const branch = await this.branchRepo.findOne({
    where: {
        id: body.branchId,
        salon: {
            user: { id: userId },
        },
    },
    relations: {
        services: true,
        salon: { user: true },
    },
});

if (!branch) {
    throw new NotFoundException('Branch not found');
}

// CHECK SERVICE BELONGS TO THIS BRANCH
const service = branch.services.find(
    (s) => s.id === body.serviceId,
);

if (!service) {
    throw new BadRequestException(
        'Invalid service for this branch',
    );
}

const teamMember = this.teamRepo.create({
    firstName: body.firstName,
    lastName: body.lastName,
    phoneNumber: body.phoneNumber,
    email: body.email,
    address: body.address,
    joiningDate: body.joiningDate,
    gender: body.gender,
    aboutMember: body.aboutMember,
    branch,
    service, // 👈 ROLE LINKED HERE
});