import { Module } from '@nestjs/common';
import { PaymentWebhookService} from './webhooks.service';
import { WebhookController} from './webhooks.controller';
import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedPackage } from 'src/purchased-packages/entities/purchased-package.entity';
import { PurchasedDeal } from 'src/purchased-deals/entities/purchased-deal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      PurchasedDeal,
      PurchasedPackage,
    ]),
  ],
  controllers: [WebhookController],
  providers: [PaymentWebhookService],
})
export class WebhooksModule {}
