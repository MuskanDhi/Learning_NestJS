import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePurchasedDealServiceDto } from './dto/create-purchased-deal-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from 'src/team-members/entities/team-member.entity';
import { Repository } from 'typeorm';
import { PurchasedDeal } from 'src/purchased-deals/entities/purchased-deal.entity';
import { PurchasedDealService } from './entities/purchased-deal-service.entity';

@Injectable()
export class PurchasedDealServicesService {
  constructor(
    @InjectRepository(PurchasedDealService)
    private purchasedDealServiceRepo: Repository<PurchasedDealService>,

    @InjectRepository(PurchasedDeal)
    private purchasedDealRepo: Repository<PurchasedDeal>,

    @InjectRepository(TeamMember)
    private teamMemberRepo: Repository<TeamMember>,
  ) {}

  async useService(
    branchId: string,
    dto: CreatePurchasedDealServiceDto,
  ) {
    const purchasedDeal =
      await this.purchasedDealRepo.findOne({
        where: {
          id: dto.purchasedDealId,
          branch: {
            id: branchId,
          },
        },
        relations: {
          branch: true,
        },
      });

    if (!purchasedDeal) {
      throw new BadRequestException(
        'Purchased deal not found for this branch',
      );
    }

    const serviceIds: string[] = [];

    if (dto.serviceId) {
      serviceIds.push(dto.serviceId);
    }

    if (dto.serviceIds?.length) {
      serviceIds.push(...dto.serviceIds);
    }

    if (serviceIds.length === 0) {
      throw new BadRequestException(
        'Please provide serviceId or serviceIds',
      );
    }

    const usedServices: {
      id: string;
      serviceName: string;
      teamMember: TeamMember;
      appointmentDate: string;
      startTime: string;
      usedAt: Date;
    }[] = [];

    const teamMember =
      await this.teamMemberRepo.findOne({
        where: {
          id: dto.teamMemberId,
          branch: {
            id: branchId,
          },
        },
      });

    if (!teamMember) {
      throw new BadRequestException(
        'Team member not found for this branch',
      );
    }

    for (const serviceId of serviceIds) {
      const item =
        await this.purchasedDealServiceRepo.findOne({
          where: {
            purchasedDeal: {
              id: dto.purchasedDealId,
            },
            service: {
              id: serviceId,
            },
          },
          relations: {
            service: true,
            purchasedDeal: true,
            teamMember: true,
          },
        });

      if (!item) {
        throw new BadRequestException(
          `Service with id ${serviceId} not found in this purchased deal`,
        );
      }

      if(
        item.purchasedDeal.expiryDate &&
        item.purchasedDeal.expiryDate < new Date()
      ) {
        throw new BadRequestException(
          `Deal has expired`,
        );
      }

      if(item.isUsed) {
        throw new BadRequestException(
          `${item.service.serviceName} already used`,
        );
      }

      item.isUsed = true;
      item.usedAt = new Date();
      item.appointmentDate = dto.appointmentDate;
      item.startTime = dto.startTime;
      item.teamMember = teamMember;

      await this.purchasedDealServiceRepo.save(item);

       usedServices.push({
         id: item.service.id,
         serviceName: item.service.serviceName,
         teamMember,
         appointmentDate: dto.appointmentDate,
         startTime: dto.startTime,
         usedAt: item.usedAt,
       });
    }

    return{
      success: true,
      branchId,
      purchasedDealId:
        dto.purchasedDealId,
      teamMember: dto.teamMemberId,
      startTime: dto.startTime,
      message:
        'Service(s) used successfully',
        services: usedServices,
    };
  }
}