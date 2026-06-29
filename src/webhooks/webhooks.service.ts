// import {
//   Injectable,
//   Logger,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';
// import { Appointment } from 'src/appointments/entities/appointment.entity';
// import { PurchasedDealService } from 'src/purchased-deal-services/entities/purchased-deal-service.entity';
// import { PurchasedDeal } from 'src/purchased-deals/entities/purchased-deal.entity';
// import { PurchasedPackageService } from 'src/purchased-package-services/entities/purchased-package-service.entity';
// import { PurchasedPackage } from 'src/purchased-packages/entities/purchased-package.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class PaymentWebhookService {
//   private readonly logger = new Logger(
//     PaymentWebhookService.name,
//   );
//   constructor(
//     @InjectRepository(Cart)
//     private readonly cartRepository: Repository<Cart>,

//     @InjectRepository(PurchasedPackage)
//     private readonly purchasedPackageRepository: Repository<PurchasedPackage>,

//     @InjectRepository(PurchasedDeal)
//     private readonly purchasedDealRepository: Repository<PurchasedDeal>,

//     @InjectRepository(PurchasedPackageService)
//     private readonly purchasedPackageServiceRepository: Repository<PurchasedPackageService>,

//     @InjectRepository(PurchasedDealService)
//     private readonly purchasedDealServiceRepository: Repository<PurchasedDealService>,

//     @InjectRepository(Appointment)
//     private readonly appointmentRepository: Repository<Appointment>,


//   ) { }

//   async handleWebhook(
//     payload: any,
//     signature: string,
//   ) {
//     try {
//       if (!payload?.event) {
//         this.logger.warn(
//           'Webhook received without event',
//         );

//         return {
//           success: false,
//           message: 'Event is missing',
//         };
//       }

//       const event = payload.event;

//       this.logger.log(
//         `Webhook Event Received: ${event}`,
//       );

//       switch (event) {
//         case 'payment.captured':
//           await this.handlePaymentCaptured(
//             payload,
//           );
//           break;

//         case 'payment.failed':
//           await this.handlePaymentFailed(
//             payload,
//           );
//           break;

//         default:
//           this.logger.warn(
//             `Unhandled event: ${event}`,
//           );
//       }

//       return {
//         success: true,
//         event,
//       };
//     } catch (error) {
//       this.logger.error(
//         `Webhook Processing Failed`,
//         error?.stack,
//       );

//       return {
//         success: false,
//         message: error.message,
//       };
//     }
//   }

//   private async handlePaymentCaptured(
//     payload: any,
//   ) {
//     const payment =
//       payload?.payload?.payment?.entity;

//     if (!payment) {
//       throw new Error(
//         'Payment entity not found',
//       );
//     }

//     const paymentId = payment.id;

//     const cartId =
//       payment.notes?.cartId;

//     if (!cartId) {
//       throw new Error(
//         'cartId not found in Razorpay notes',
//       );
//     }

//     const cart =
//       await this.cartRepository.findOne({
//         where: {
//           id: cartId,
//         },
//         relations: {
//           user: true,
//           branch: true,
//           service: true,
//           teamMember: true,
//           package: {
//             services: true,
//           },
//           deal: {
//             services: true,
//           },
//         },
//       });

//     if (!cart) {
//       throw new Error('Cart not found');
//     }

//     this.logger.log(
//       `Cart Found: ${cart.id}`,
//     );

//     if (
//       cart.type === 'service' &&
//       cart.service &&
//       cart.teamMember &&
//       cart.appointmentDate &&
//       cart.startTime
//     ) {
//       const existingAppointment =
//         await this.appointmentRepository.findOne({
//           where: {
//             appointmentDate:
//               cart.appointmentDate,
//             appointmentStartTime:
//               cart.startTime,
//             teamMember: {
//               id: cart.teamMember.id,
//             },
//           },
//           relations: {
//             teamMember: true,
//           },
//         });

//       if (!existingAppointment) {
//         await this.appointmentRepository.save({
//           appointmentDate: cart.appointmentDate,
//           appointmentStartTime: cart.startTime,
//           appointmentEndTime: cart.startTime,
//           slots: [cart.startTime],
//           status: 'BOOKED',
//           branch: cart.branch,
//           teamMember: cart.teamMember,
//           services: [cart.service],
//         });
//       }

//       await this.cartRepository.delete(cart.id);

//       this.logger.log(
//         `Appointment Created: cartId=${cart.id}`,
//       );

//     }

//     // PACKAGE PURCHASE
//     if (cart.package) {

//       const existingPackagePurchase =
//         await this.purchasedPackageRepository.findOne({
//           where: {
//             paymentId,
//           },
//         });

//       if (!existingPackagePurchase) {

//         let expiryDate = new Date();

//         if (cart.package.unit === 'day') {
//           expiryDate.setDate(
//             expiryDate.getDate() +
//             cart.package.number,
//           );
//         }

//         if (cart.package.unit === 'month') {
//           expiryDate.setMonth(
//             expiryDate.getMonth() +
//             cart.package.number,
//           );
//         }

//         if (cart.package.unit === 'year') {
//           expiryDate.setFullYear(
//             expiryDate.getFullYear() +
//             cart.package.number,
//           );
//         }

//         const purchasedPackage =
//           await this.purchasedPackageRepository.save({
//             user: cart.user,
//             package: cart.package,
//             branch: cart.branch,
//             paymentId,
//             status: 'SUCCESS',
//             expiryDate,
//           });

//         for (const service of cart.package.services) {
//           await this.purchasedPackageServiceRepository.save({
//             purchasedPackage,
//             service,
//             isUsed: false,
//           });
//         }

//         this.logger.log(
//           `Purchased Package Created:
//        packageId=${cart.package.id}`,
//         );
//       }

//       await this.cartRepository.delete(cart.id);
//     }

//     // DEAL PURCHASE
//     if (cart.deal) {

//       const existingDealPurchase =
//         await this.purchasedDealRepository.findOne({
//           where: {
//             paymentId,
//           },
//         });

//       if (!existingDealPurchase) {

//         const expiryDate = new Date(cart.deal.endDate);

//         const purchasedDeal =
//           await this.purchasedDealRepository.save({
//             user: cart.user,
//             deal: cart.deal,
//             branch: cart.branch,
//             paymentId,
//             status: 'SUCCESS',
//             expiryDate
//           });

//         for (const service of cart.deal.services) {
//           await this.purchasedDealServiceRepository.save({
//             purchasedDeal,
//             service,
//             isUsed: false,
//           });
//         }

//         this.logger.log(
//           `Purchased Deal Created:
//          dealId=${cart.deal.id}`,
//         );
//         await this.cartRepository.delete(cart.id);
//       }
//     }
//   }

//   private async handlePaymentFailed(
//     payload: any,
//   ) {
//     const payment =
//       payload?.payload?.payment?.entity;

//     if (!payment) {
//       throw new Error(
//         'Payment entity not found',
//       );
//     }

//     this.logger.warn(
//       `Payment Failed:
//      paymentId=${payment.id}
//      amount=${payment.amount}
//      status=${payment.status}`,
//     );

//     const cartId =
//       payment?.notes?.cartId;

//     if (!cartId) {
//       return;
//     }

//     const cart =
//       await this.cartRepository.findOne({
//         where: {
//           id: cartId,
//         },
//       });

//     if (cart) {
//       cart.slotStatus = 'EXPIRED';

//       cart.slotExpiresAt = null;

//       await this.cartRepository.save(
//         cart,
//       );
//     }
//   }
// }

import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PurchasedPackage } from 'src/purchased-packages/entities/purchased-package.entity';
import { PurchasedPackageService } from 'src/purchased-package-services/entities/purchased-package-service.entity';
import { PurchasedDeal } from 'src/purchased-deals/entities/purchased-deal.entity';
import { PurchasedDealService } from 'src/purchased-deal-services/entities/purchased-deal-service.entity';

@Injectable()
export class PaymentWebhookService {
  private readonly logger = new Logger(
    PaymentWebhookService.name,
  );

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(PurchasedPackage)
    private readonly purchasedPackageRepository: Repository<PurchasedPackage>,

    @InjectRepository(PurchasedDeal)
    private readonly purchasedDealRepository: Repository<PurchasedDeal>,

    @InjectRepository(PurchasedPackageService)
    private readonly purchasedPackageServiceRepository: Repository<PurchasedPackageService>,

    @InjectRepository(PurchasedDealService)
    private readonly purchasedDealServiceRepository: Repository<PurchasedDealService>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) { }

  async handleWebhook(
    payload: any,
    signature: string,
  ) {
    try {
      if (!payload?.event) {
        this.logger.warn(
          'Webhook received without event',
        );

        return {
          success: false,
          message: 'Event is missing',
        };
      }

      const event = payload.event;

      this.logger.log(
        `Webhook Event Received: ${event}`,
      );

      switch (event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(
            payload,
          );
          break;

        case 'payment.failed':
          await this.handlePaymentFailed(
            payload,
          );
          break;

        default:
          this.logger.warn(
            `Unhandled event: ${event}`,
          );
      }

      return {
        success: true,
        event,
      };
    } catch (error) {
      this.logger.error(
        'Webhook Processing Failed',
        error?.stack,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  private async handlePaymentCaptured(
    payload: any,
  ) {
    const payment =
      payload?.payload?.payment?.entity;

    if (!payment) {
      throw new Error(
        'Payment entity not found',
      );
    }

    const paymentId = payment.id;

    const cartId =
      payment.notes?.cartId;

    if (!cartId) {
      throw new Error(
        'cartId not found in Razorpay notes',
      );
    }

    const cart =
      await this.cartRepository.findOne({
        where: {
          id: cartId,
        },
        relations: {
          user: true,
          customer: true,
          branch: {
            salon: true,
          },
          service: true,
          teamMember: true,
          package: {
            services: true,
          },
          deal: {
            services: true,
          },
        },
      });

    if (!cart) {
      throw new Error('Cart not found');
    }

    this.logger.log(
      `Cart Found: ${cart.id}`,
    );

    // SERVICE APPOINTMENT
    if (
      cart.type === 'service' &&
      cart.service &&
      cart.teamMember &&
      cart.appointmentDate &&
      cart.startTime
    ) {
      const existingAppointment =
        await this.appointmentRepository.findOne({
          where: {
            appointmentDate:
              cart.appointmentDate,
            appointmentStartTime:
              cart.startTime,
            teamMember: {
              id: cart.teamMember.id,
            },
          },
          relations: {
            teamMember: true,
          },
        });

      if (!existingAppointment) {
        await this.appointmentRepository.save({
          appointmentDate: cart.appointmentDate,

          appointmentStartTime: cart.startTime,

          appointmentEndTime: cart.startTime,

          slots: [cart.startTime],

          status: 'BOOKED',

          branch: cart.branch,

          salon: cart.branch?.salon,

          customer: cart.customer,

          teamMember: cart.teamMember,

          services: [cart.service],
        });

        this.logger.log(
          `Appointment Created: cartId=${cart.id}`,
        );
      } else {
        this.logger.warn(
          `Appointment already exists for cart ${cart.id}`,
        );
      }

      await this.cartRepository.delete(
        cart.id,
      );

      return;
    }

    // PACKAGE PURCHASE
    if (cart.package) {
      const existingPackagePurchase =
        await this.purchasedPackageRepository.findOne({
          where: {
            paymentId,
          },
        });

      if (!existingPackagePurchase) {
        const expiryDate = new Date();

        if (cart.package.unit === 'day') {
          expiryDate.setDate(
            expiryDate.getDate() +
            cart.package.number,
          );
        }

        if (cart.package.unit === 'month') {
          expiryDate.setMonth(
            expiryDate.getMonth() +
            cart.package.number,
          );
        }

        if (cart.package.unit === 'year') {
          expiryDate.setFullYear(
            expiryDate.getFullYear() +
            cart.package.number,
          );
        }

        const purchasedPackage =
          await this.purchasedPackageRepository.save({
            user: cart.user,
            package: cart.package,
            branch: cart.branch,
            paymentId,
            status: 'SUCCESS',
            expiryDate,
          });

        for (const service of cart.package.services) {
          await this.purchasedPackageServiceRepository.save({
            purchasedPackage,
            service,
            isUsed: false,
          });
        }

        this.logger.log(
          `Purchased Package Created: packageId=${cart.package.id}`,
        );
      }

      await this.cartRepository.delete(
        cart.id,
      );

      return;
    }

    // DEAL PURCHASE
    if (cart.deal) {
      const existingDealPurchase =
        await this.purchasedDealRepository.findOne({
          where: {
            paymentId,
          },
        });

      if (!existingDealPurchase) {
        const expiryDate = new Date(
          cart.deal.endDate,
        );

        const purchasedDeal =
          await this.purchasedDealRepository.save({
            user: cart.user,
            deal: cart.deal,
            branch: cart.branch,
            paymentId,
            status: 'SUCCESS',
            expiryDate,
          });

        for (const service of cart.deal.services) {
          await this.purchasedDealServiceRepository.save({
            purchasedDeal,
            service,
            isUsed: false,
          });
        }

        this.logger.log(
          `Purchased Deal Created: dealId=${cart.deal.id}`,
        );
      }

      await this.cartRepository.delete(
        cart.id,
      );
    }
  }

  private async handlePaymentFailed(
    payload: any,
  ) {
    const payment =
      payload?.payload?.payment?.entity;

    if (!payment) {
      throw new Error(
        'Payment entity not found',
      );
    }

    this.logger.warn(
      `Payment Failed:
paymentId=${payment.id}
amount=${payment.amount}
status=${payment.status}`,
    );

    const cartId =
      payment?.notes?.cartId;

    if (!cartId) {
      return;
    }

    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId,
      },
      relations: {
        user: true,
        customer: true,
        branch: {
          salon: true,
        },
        service: true,
        teamMember: true,
        package: {
          services: true,
        },
        deal: {
          services: true,
        },
      },
    });

    if (cart) {
      cart.slotStatus = 'EXPIRED';
      cart.slotExpiresAt = null;

      await this.cartRepository.save(
        cart,
      );

      this.logger.warn(
        `Cart expired: ${cart.id}`,
      );
    }
  }
}