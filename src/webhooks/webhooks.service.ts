import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';
import { PurchasedDeal } from 'src/purchased-deals/entities/purchased-deal.entity';
import { PurchasedPackage } from 'src/purchased-packages/entities/purchased-package.entity';
import { Repository } from 'typeorm';

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
        `Webhook Processing Failed`,
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
      });

    if (!cart) {
      throw new Error('Cart not found');
    }

    this.logger.log(
      `Cart Found: ${cart.id}`,
    );

    // PACKAGE PURCHASE
    if (cart.package) {

      const existingPackagePurchase =
        await this.purchasedPackageRepository.findOne({
          where: {
            paymentId,
          },
        });

      if (!existingPackagePurchase) {

        await this.purchasedPackageRepository.save({
          user: cart.user,
          package: cart.package,
          branch: cart.branch,
          paymentId,
          status: 'SUCCESS',
        });

        this.logger.log(
          `Purchased Package Created:
         packageId=${cart.package.id}`,
        );
      }
      await this.cartRepository.delete(cart.id);
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

        await this.purchasedDealRepository.save({
          user: cart.user,
          deal: cart.deal,
          branch: cart.branch,
          paymentId,
          status: 'SUCCESS',
        });

        this.logger.log(
          `Purchased Deal Created:
         dealId=${cart.deal.id}`,
        );
        await this.cartRepository.delete(cart.id);
      }
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
  }
}