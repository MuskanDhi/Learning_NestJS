import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
  ],
  controllers: [RazorpayController],
  providers: [RazorpayService],
})
export class RazorpayModule {}
