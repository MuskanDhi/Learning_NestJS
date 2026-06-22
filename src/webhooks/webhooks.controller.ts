import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentWebhookService } from './webhooks.service';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly webhookService: PaymentWebhookService,
  ) {}

  @Post('razorpay')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-razorpay-signature')
    signature: string,
  ) {
    return this.webhookService.handleWebhook(
      req.body,
      signature,
    );
  }
}