import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from 'src/razorpay/entities/razorpay.entity';

import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
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
      receipt: `cart_${cart.id.substring(0, 10)}`,
      //receipt: cart.id,
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

  async getOrder(orderId: string) {
    if (!orderId) {
      throw new BadRequestException('orderId is required');
    }

    try {
      const order = await this.razorpay.orders.fetch(orderId);

      return {
        success: true,
        message: 'Order fetched successfully',
        order,
      };
    } catch (error) {
      console.error('Razorpay getOrder error:', error);

      throw new NotFoundException(
        error?.error?.description || error.message || 'Order not found',
      );
    }
  }

  async verifyPayment(body: any) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new NotFoundException('Missing payment details');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return {
        success: false,
        message: 'Payment verification failed (invalid signature)',
      };
    }

    // ✅ SUCCESS CASE
    // (Here you should update DB: order/payment status = PAID)

    const payment = await this.razorpay.payments.fetch(
      razorpay_payment_id,
    );

    const order = await this.razorpay.orders.fetch(
      razorpay_order_id,
    );

    if (!order.notes || !order.notes.cartId) {
      throw new BadRequestException('Cart ID not found in Razorpay order notes');
    }

    const cartId = String(order.notes.cartId);

    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId,
      },
      relations: {
        user: true,
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: {
        paymentId: razorpay_payment_id,
      },
    });

    if (!existingPayment) {
      const paymentEntity = this.paymentRepository.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: Number(payment.amount) / 100,
        currency: payment.currency,
        status: payment.status,
        userId: cart.user.id,
        cartId: cart.id,
      });

      await this.paymentRepository.save(paymentEntity);
    }

    return {
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    };
  }

  async refundPayment(paymentId: string, amount?: number) {
    if (!paymentId) {
      throw new BadRequestException('Payment ID is required');
    }

    const payment = await this.razorpay.payments.fetch(paymentId);
    try {
      const paymentAmount = Number(payment.amount);
      const refundAmount = amount ? Math.round(amount * 100) : 0;

      if (refundAmount > paymentAmount) {
        throw new BadRequestException(
          `Refund cannot exceed paid amount ₹${paymentAmount / 100}`,
        );
      }

      const refund = await this.razorpay.payments.refund(paymentId, {
        ...(amount && { amount: Math.round(amount * 100) }),
      });

      return {
        success: true,
        message: 'Refund initiated successfully',
        refund,
      };

    } catch (error) {
      throw new BadRequestException(
        error?.error?.description || error.message,
      );
    }
  }
}