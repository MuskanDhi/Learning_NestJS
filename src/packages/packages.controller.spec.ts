import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';

describe('PackagesController', () => {
  let controller: PackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagesController],
    }).compile();

    controller = module.get<PackagesController>(PackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Branch } from 'src/branches/entities/branch.entity';
import { Service } from 'src/services/entities/services.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  packageName: string;

  @Column()
  originalPrice: string;

  @Column()
  offeredPrice: string;

  @Column()
  duration: string;

  @Column({
    type: 'enum',
    enum: ['day', 'month', 'year'],
  })
  unit: string;

  @ManyToOne(
    () => Branch,
    (branch) => branch.packages,
    {
      onDelete: 'CASCADE',
    },
  )
  branch: Branch;

  @ManyToMany(
    () => Service,
    (service) => service.packages,
    {
      eager: true,
    },
  )
  @JoinTable()
  services: Service[];
}