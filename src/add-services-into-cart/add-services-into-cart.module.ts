import { Module } from '@nestjs/common';
import { AddServicesIntoCartService } from './add-services-into-cart.service';
import { AddServicesIntoCartController } from './add-services-into-cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Service } from 'src/services/entities/services.entity';
import { Cart } from './entities/add-services-into-cart.entity';
import { User } from 'src/users/entities/user.entity';
import { Deal } from 'src/deals/entities/deal.entity';
import { Package } from 'src/packages/entities/package.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Service,
            User,
            Cart,
            Package,
            Deal,
        ]),
        AuthModule,
    ],
    controllers: [AddServicesIntoCartController],
    providers: [AddServicesIntoCartService],
})
export class AddServicesIntoCartModule { }
