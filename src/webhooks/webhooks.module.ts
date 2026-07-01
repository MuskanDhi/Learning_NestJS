import { Module } from '@nestjs/common';
import { PaymentWebhookService} from './webhooks.service';
import { WebhookController} from './webhooks.controller';
import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedPackage } from 'src/purchased-packages/entities/purchased-package.entity';
import { PurchasedDeal } from 'src/purchased-deals/entities/purchased-deal.entity';
import { PurchasedPackageService } from 'src/purchased-package-services/entities/purchased-package-service.entity';
import { PurchasedDealService } from 'src/purchased-deal-services/entities/purchased-deal-service.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Payment } from 'src/razorpay/entities/razorpay.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      PurchasedDeal,
      PurchasedPackage,
      PurchasedPackageService,
      PurchasedDealService,
      Appointment,
      Payment,
    ]),
  ],
  controllers: [WebhookController],
  providers: [PaymentWebhookService],
})
export class WebhooksModule {}
