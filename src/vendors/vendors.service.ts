import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,

    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>
  ) { }

  async create(branchId: string, dto: CreateVendorDto) {
    const branch = await this.branchRepo.findOne({
      where: {
        id: branchId,
      },
    });

    if (!branch) {
      throw new BadRequestException('Branch not found');
    }

    if (!dto.vendorName) {
      throw new BadRequestException('vendorName is required');
    }

    if (!dto.vendorPhone) {
      throw new BadRequestException('vendorPhone is required');
    }

    if (!dto.vendorEmail) {
      throw new BadRequestException('vendorEmail is required');
    }

    const existingVendor = await this.vendorRepo.findOne({
      where: {
        vendorPhone: dto.vendorPhone,
      },
    });

    if (existingVendor) {
      throw new BadRequestException('Vendor with this phone number already exists');
    }

    const existingVendorEmail = await this.vendorRepo.findOne({
      where: {
        vendorEmail: dto.vendorEmail,
      },
    });

    if (existingVendorEmail) {
      throw new BadRequestException('Vendor with this email already exists');
    }

    const vendor = this.vendorRepo.create({
      ...dto,
      branch,
    });

    await this.vendorRepo.save(vendor);

    return {
      message: 'Vendor created successfully',
      vendor,
    };
  }

  async findAll(branchId: string) {
    return this.vendorRepo.find({
      where: {
        branch: {
          id: branchId,
        },
      },
      relations: {
        branch: true,
      },
    });
  }
}
