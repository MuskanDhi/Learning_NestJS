import { Test, TestingModule } from '@nestjs/testing';
import { TeamMembersController } from './team-members.controller';

describe('TeamMembersController', () => {
  let controller: TeamMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamMembersController],
    }).compile();

    controller = module.get<TeamMembersController>(TeamMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
    In,
    Repository,
} from 'typeorm';

import { TeamMember } from './entities/team-member.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Service } from 'src/services/entities/services.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';

@Injectable()
export class TeamMembersService {

    constructor(

        @InjectRepository(TeamMember)
        private teamMemberRepo: Repository<TeamMember>,

        @InjectRepository(Branch)
        private branchRepo: Repository<Branch>,

        @InjectRepository(Service)
        private serviceRepo: Repository<Service>,
    ) {}

    async create(
        branchId: string,
        dto: CreateTeamMemberDto,
    ) {

        const branch =
            await this.branchRepo.findOne({
                where: {
                    id: branchId,
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }

        const existingEmail =
            await this.teamMemberRepo.findOne({
                where: {
                    email: dto.email,
                },
            });

        if (existingEmail) {
            throw new BadRequestException(
                'Email already exists',
            );
        }

        const existingPhone =
            await this.teamMemberRepo.findOne({
                where: {
                    phoneNumber:
                        dto.phoneNumber,
                },
            });

        if (existingPhone) {
            throw new BadRequestException(
                'Phone number already exists',
            );
        }

        const services =
            await this.serviceRepo.find({
                where: {
                    id: In(dto.serviceIds),
                },
                relations: {
                    subCategory: {
                        category: {
                            branch: true,
                        },
                    },
                },
            });

        if (
            services.length !==
            dto.serviceIds.length
        ) {
            throw new BadRequestException(
                'One or more services not found',
            );
        }

        const invalidService =
            services.find(
                (service) =>
                    service.subCategory
                        .category
                        .branch
                        .id !== branchId,
            );

        if (invalidService) {
            throw new BadRequestException(
                'Selected service does not belong to this branch',
            );
        }

        const teamMember =
            this.teamMemberRepo.create({
                firstName:
                    dto.firstName,

                lastName:
                    dto.lastName,

                email:
                    dto.email,

                phoneNumber:
                    dto.phoneNumber,

                address:
                    dto.address,

                joiningDate:
                    dto.joiningDate,

                aboutMember:
                    dto.aboutMember,

                gender:
                    dto.gender,

                branch,

                services,
            });

        await this.teamMemberRepo.save(
            teamMember,
        );

        return {
            message:
                'Team member created successfully',

            branch: {
                id: branch.id,
                name: branch.name,
            },

            teamMember,
        };
    }
}