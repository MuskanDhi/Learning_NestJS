import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddServicesIntoCartDto } from './dto/create-add-services-into-cart.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/services/entities/services.entity';
import { Cart } from './entities/add-services-into-cart.entity';
import { Package } from 'src/packages/entities/package.entity';
import { Deal } from 'src/deals/entities/deal.entity';

@Injectable()
export class AddServicesIntoCartService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,

    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(Package)
    private packageRepo: Repository<Package>,

    @InjectRepository(Deal)
    private dealRepo: Repository<Deal>

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

    let cart: Cart;

    if (dto.type === 'service') {

      const service =
        await this.serviceRepo.findOne({
          where: {
            id: dto.referenceId,
          },
        });

      if (!service) {
        throw new BadRequestException(
          'Service not found',
        );
      }

      cart = this.cartRepo.create({
        user,
        branch: {
          id: branchId,
        },
        type: 'service',
        service,
      });

    } else if (dto.type === 'package') {

      const pkg =
        await this.packageRepo.findOne({
          where: {
            id: dto.referenceId,
          },
          relations: {
            services: true,
            branch: true,
          },
        });

      if (!pkg) {
        throw new BadRequestException(
          'Package not found',
        );
      }

      cart = this.cartRepo.create({
        user,
        branch: {
          id: branchId,
        },
        type: 'package',
        package: pkg,
      });

    } else {

      const deal =
        await this.dealRepo.findOne({
          where: {
            id: dto.referenceId,
          },
          relations: {
            services: true,
            branch: true,
          },
        });

      if (!deal) {
        throw new BadRequestException(
          'Deal not found',
        );
      }

      cart = this.cartRepo.create({
        user,
        branch: {
          id: branchId,
        },
        type: 'deal',
        deal,
      });
    }

    await this.cartRepo.save(cart);

    return {
      success: true,
      message: 'Added to cart successfully',
      cart,
    };
  }

  async getCart(branchId: string, userId: string) {
    const cartItems = await this.cartRepo.find({
      where: {
        user: {
          id: userId,
        },
        branch: {
          id: branchId,
        },
      },
      relations: {
        user: true,
        branch: true,
        package: {
          services: true,
        },
        deal: {
          services: true,
        },
        service: true,
      },
    });

    const formattedCart = cartItems.map((item) => ({
      id: item.id,
      user: item.user,
      branch: {
        ...item.branch,
        packages: item.package ? [item.package] : [],
        deals: item.deal ? [item.deal] : [],
        services: item.service ? [item.service] : [],
      },
      createdAt: item.createdAt,
    }));

    return {
      success: true,
      totalItems: formattedCart.length,
      message: 'Cart items retrieved successfully',
      cartItems: formattedCart,
    };
  }
}