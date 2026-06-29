import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddServicesIntoCartDto } from './dto/create-add-services-into-cart.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/services/entities/services.entity';
import { Cart } from './entities/add-services-into-cart.entity';
import { Package } from 'src/packages/entities/package.entity';
import { Deal } from 'src/deals/entities/deal.entity';
import { TeamMember } from 'src/team-members/entities/team-member.entity';
import { SelectSlotDto } from './dto/select-slot.dto';
import { Customer } from 'src/customers/entities/customer.entity';

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
    private dealRepo: Repository<Deal>,

    @InjectRepository(TeamMember)
    private teamMemberRepo: Repository<TeamMember>,

    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

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

    const customer = await this.customerRepo.findOne({
      where: {
        id: dto.customerId,
      },
    });

    if (!customer) {
      throw new BadRequestException(
        'Customer not found',
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
        customer,
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
        customer,
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
        customer,
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

  // async selectSlot(
  //   cartId: string,
  //   dto: SelectSlotDto,
  // ) {
  //   const cart = await this.cartRepo.findOne({
  //     where: {
  //       id: cartId,
  //     },
  //     relations: {
  //       service: true,
  //     },
  //   });

  //   if (!cart) {
  //     throw new BadRequestException(
  //       'Cart not found',
  //     );
  //   }

  //   const teamMember =
  //     await this.teamMemberRepo.findOne({
  //       where: {
  //         id: dto.teamMemberId,
  //       },
  //     });

  //   if (!teamMember) {
  //     throw new BadRequestException(
  //       'Team member not found',
  //     );
  //   }

  //   cart.teamMember = teamMember;
  //   cart.appointmentDate =
  //     dto.appointmentDate;
  //   cart.startTime =
  //     dto.startTime;

  //   cart.slotStatus = 'RESERVED';

  //   cart.slotExpiresAt =
  //     new Date(
  //       Date.now() + 10 * 60 * 1000,
  //     );

  //   await this.cartRepo.save(cart);

  //   return {
  //     success: true,
  //     message: 'Slot reserved successfully',
  //     cart,
  //   };
  // }

  async selectSlot(
    cartId: string,
    dto: SelectSlotDto,
  ) {
    const cart = await this.cartRepo.findOne({
      where: {
        id: cartId,
      },
      relations: {
        service: true,
      },
    });

    if (!cart) {
      throw new BadRequestException(
        'Cart not found',
      );
    }

    const teamMember =
      await this.teamMemberRepo.findOne({
        where: {
          id: dto.teamMemberId,
        },
      });

    if (!teamMember) {
      throw new BadRequestException(
        'Team member not found',
      );
    }

    cart.teamMember = teamMember;

    cart.appointmentDate =
      dto.appointmentDate;

    cart.startTime =
      dto.startTime;

    // HOLD THE SLOT
    cart.slotStatus = 'HOLD';

    // 10 minutes expiry
    cart.slotExpiresAt =
      new Date(
        Date.now() + 10 * 60 * 1000,
      );

    await this.cartRepo.save(cart);

    return {
      success: true,
      message: 'Slot placed on hold successfully',
      cart,
    };
  }
}