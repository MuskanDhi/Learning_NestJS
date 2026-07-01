import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { CreateRazorpayDto } from './dto/create-razorpay.dto';
import { UpdateRazorpayDto } from './dto/update-razorpay.dto';
@Controller('razorpay')
export class RazorpayController {
  constructor(
    private readonly razorpayService: RazorpayService,
  ) { }

  @Post('create-order')
  createOrder(@Body('cartId') cartId: string) {
    return this.razorpayService.createOrder(cartId);
  }

  @Get('order/:orderId')
  async getOrder(
    @Param('orderId') orderId: string,
  ) {
    return this.razorpayService.getOrder(orderId);
  }

  @Post('verify')
  verifyPayment(@Body() body: any) {
    return this.razorpayService.verifyPayment(body);
  }

   @Post('refund')
  refundPayment(
    @Body()
    body: {
      paymentId: string;
      amount?: number; // optional → partial refund
    },
  ) {
    return this.razorpayService.refundPayment(
      body.paymentId,
      body.amount,
    );
  }
}
