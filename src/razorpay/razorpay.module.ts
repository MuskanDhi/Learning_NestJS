import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';
import { Payment } from './entities/razorpay.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Payment]),
  ],
  controllers: [RazorpayController],
  providers: [RazorpayService],
})
export class RazorpayModule {}
