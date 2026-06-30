import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Razorpay from 'razorpay';

import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(cartId: string) {
    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId,
      },
      relations: {
        service: true,
        package: true,
        deal: true,
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    let amount = 0;

    // Service
    if (cart.service) {
      amount = Number(cart.service.price);
    }

    // Package
    else if (cart.package) {
      amount = Number(cart.package.offeredPrice);
    }

    // Deal
    else if (cart.deal) {
      amount = Number(cart.deal.offeredPrice); // or deal.price (according to your entity)
    }

    if (!amount) {
      throw new NotFoundException('Amount not found');
    }

    const order = await this.razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      // receipt: `receipt_${cart.id}`,
      receipt: cart.id,
      notes: {
        cartId: cart.id,
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    };
  }
}