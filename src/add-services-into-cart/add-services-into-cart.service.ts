import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddServicesIntoCartDto } from './dto/create-add-services-into-cart.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/services/entities/services.entity';
import { Cart } from './entities/add-services-into-cart.entity';

@Injectable()
export class AddServicesIntoCartService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,

    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
  ) { }

  async addServiceToCart(
    branchId: string,
    userId: string,
    dto: CreateAddServicesIntoCartDto,
  ) {

    const user =
      await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new BadRequestException(
        'User not found',
      );
    }

    const service =
      await this.serviceRepo.findOne({
        where: {
          id: dto.serviceId,
        },
      });

    if (!service) {
      throw new BadRequestException(
        'Service not found',
      );
    }

    const cart =
      this.cartRepo.create({
        user,
        service,
        type: dto.type,
        referenceId: dto.referenceId,
        branch: {
          id: branchId,
        },
      });

    await this.cartRepo.save(cart);

    return {
      success: true,
      message: 'Added to cart successfully',
      cart,
    };
  }

  async getCart(branchId: string, userId: string) {
    const user =
      await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new BadRequestException(
        'User not found',
      );
    }

    const cartItems =
      await this.cartRepo.find({
        where: {
          user: {
            id: userId,
          },
          branch: {
            id: branchId,
          },
        },
        relations: {
          service: true,
          user: true,
          branch: true,
        },
      });

    return {
      success: true,
      totalItems: cartItems.length,
      message: 'Cart items retrieved successfully',
      cartItems,
    };
  }
}
