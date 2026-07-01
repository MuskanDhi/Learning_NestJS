import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
  Body,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentWebhookService } from './webhooks.service';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly webhookService: PaymentWebhookService,
  ) { }
  @Post('razorpay')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-razorpay-signature')
    signature: string,
  ) {
    console.log(req.body.event);
    return this.webhookService.handleWebhook(
      req.body,
      signature,
    );
  }

  @Post('payment-link')
  async createPaymentLink(
    @Body()
    body: {
      amount: number;
      orderId: string;
      name: string;
      email: string;
      contact: string;
    },
  ) {
    return this.webhookService.createPaymentLink(body);
  }
}