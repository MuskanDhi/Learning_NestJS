import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SalonsModule } from './salons/salons.module';
import { BranchesModule } from './branches/branches.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { ServicesModule } from './services/services.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { PackagesModule } from './packages/packages.module';
import { DealsModule } from './deals/deals.module';
import { ConstantModule } from './constants/constants.module';
import { CustomersModule } from './customers/customers.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AlarmModule } from './alarm/alarm.module';
import { LocationModule } from './location/location.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { NotificationGateway } from './notification/notification.gateway';
import { NotificationModule } from './notification/notification.module';
import { RedisModule } from './redis/redis.module';
import { PurchasedPackagesModule } from './purchased-packages/purchased-packages.module';
import { PurchasedDealsModule } from './purchased-deals/purchased-deals.module';
import { PurchasedPackageServicesModule } from './purchased-package-services/purchased-package-services.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    FileUploadModule,
    AuthModule,
    UsersModule,
    SalonsModule,
    BranchesModule,
    TeamMembersModule,
    ServicesModule,
    CategoriesModule,
    SubCategoriesModule,
    PackagesModule,
    DealsModule,
    ConstantModule,
    CustomersModule,
    AppointmentsModule,
    FileUploadModule,
    AlarmModule,
    LocationModule,
    ChatModule,
    NotificationModule,
    RedisModule,
    PurchasedPackagesModule,
    PurchasedDealsModule,
    PurchasedPackageServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGateway],
})
export class AppModule { }
