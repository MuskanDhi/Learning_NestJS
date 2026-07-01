import {
  BadRequestException,
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
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { Payment } from 'src/razorpay/entities/razorpay.entity';

@Injectable()
export class PaymentWebhookService {
  private readonly logger = new Logger(
    PaymentWebhookService.name,
  );
  private readonly razorpay: Razorpay;

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

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  private timeToMinutes(time: string): number {
    const [timePart, period] = time.split(' ');

    let [hours, minutes] = timePart.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    totalMinutes %= 1440;

    let hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;

    if (hours === 0) {
      hours = 12;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${period}`;
  }

  async handleWebhook(
    payload: any,
    signature: string,
  ) {
    try {
      // Skip webhook signature verification in development
      // Skip verification in local development
      // if (process.env.NODE_ENV !== 'development') {
      //   const expectedSignature = crypto
      //     .createHmac(
      //       'sha256',
      //       process.env.RAZORPAY_WEBHOOK_SECRET!,
      //     )
      //     .update(JSON.stringify(payload))
      //     .digest('hex');

      //   if (expectedSignature !== signature) {
      //     throw new Error('Invalid webhook signature');
      //   }
      // }
      this.logger.log(
        `Webhook Received: ${JSON.stringify(payload, null, 2)}`,
      );
      console.log(JSON.stringify(payload, null, 2));
      if (!payload?.event) {
        this.logger.warn('Webhook received without event');

        return {
          success: false,
          message: 'Event is missing',
        };
      }

      const event = payload.event;

      this.logger.log(`Webhook Event Received: ${event}`);

      switch (event) {
        case 'payment.authorized':
          this.logger.log(
            `Payment Authorized: ${payload.payload.payment.entity.id}`,
          );
          break;

        case 'payment.captured':
          await this.handlePaymentCaptured(payload);
          break;

        case 'payment.failed':
          await this.handlePaymentFailed(payload);
          break;

        case 'refund.created':
          this.logger.log(
            `Refund Created: ${payload.payload.refund.entity.id}`,
          );
          break;

        case 'refund.processed':
          this.logger.log(
            `Refund Processed: ${payload.payload.refund.entity.id}`,
          );
          break;

        case 'refund.failed':
          this.logger.log(
            `Refund Failed: ${payload.payload.refund.entity.id}`,
          );
          break;

        case 'order.paid':
          this.logger.log(
            `Order Paid: ${payload.payload.order.entity.id}`,
          );
          break;

        default:
          this.logger.warn(`Unhandled event: ${event}`);
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
        // await this.appointmentRepository.save({
        //   appointmentDate: cart.appointmentDate,

        //   appointmentStartTime: cart.startTime,

        //   appointmentEndTime: cart.startTime,

        //   slots: [cart.startTime],

        //   status: 'BOOKED',

        //   branch: cart.branch,

        //   salon: cart.branch?.salon,

        //   customer: cart.customer,

        //   teamMember: cart.teamMember,

        //   services: [cart.service],
        // });
        const startMinutes = this.timeToMinutes(cart.startTime);

        const durationMinutes = parseInt(
          cart.service.duration.replace(/\D/g, ''),
          10,
        );

        const endMinutes = startMinutes + durationMinutes;

        const appointmentEndTime =
          this.minutesToTime(endMinutes);

        const slots: string[] = [];

        for (
          let current = startMinutes;
          current < endMinutes;
          current += 15
        ) {
          slots.push(this.minutesToTime(current));
        }

        await this.appointmentRepository.save({
          appointmentDate: cart.appointmentDate,

          appointmentStartTime: cart.startTime,

          appointmentEndTime,

          slots,

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

  // payment happens but according to cartId not for orderId
  // async createPaymentLink(data: {
  //   amount: number;
  //   orderId: string;
  //   name: string;
  //   email: string;
  //   contact: string;
  // }) {
  //   const paymentLink =
  //     await this.razorpay.paymentLink.create({
  //       amount: data.amount,
  //       currency: 'INR',

  //       accept_partial: false,

  //       description: 'Salon Booking',

  //       customer: {
  //         name: data.name,
  //         email: data.email,
  //         contact: data.contact,
  //       },

  //       notify: {
  //         sms: false,
  //         email: false,
  //       },

  //       reminder_enable: false,

  //       callback_url: 'http://localhost:3000/payment-success',

  //       callback_method: 'get',

  //       notes: {
  //         cartId: data.cartId,
  //       },
  //     });

  //   return {
  //     success: true,
  //     paymentLinkId: paymentLink.id,
  //     paymentLink: paymentLink.short_url,
  //   };
  // }

  // payment happens for orderId not for cartId but as we use payment link for payment in this orderId new created
  async createPaymentLink(data: {
    amount: number;
    orderId: string;
    name: string;
    email: string;
    contact: string;
  }) {
    const paymentLink =
      await this.razorpay.paymentLink.create({
        amount: data.amount,
        currency: 'INR',

        accept_partial: false,

        description: 'Salon Booking',

        customer: {
          name: data.name,
          email: data.email,
          contact: data.contact,
        },

        notify: {
          sms: false,
          email: false,
        },

        reminder_enable: false,

        callback_url: 'http://localhost:3000/payment-success',

        callback_method: 'get',

        notes: {
          orderId: data.orderId,
        },
      });

    return {
      success: true,
      paymentLinkId: paymentLink.id,
      paymentLink: paymentLink.short_url,
    };
  }
}