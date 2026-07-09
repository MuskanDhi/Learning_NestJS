import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SalonsModule } from './salons/salons.module';
import { BranchesModule } from './branches/branches.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { ServicesModule } from './services/services.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AddServicesIntoCartModule } from './add-services-into-cart/add-services-into-cart.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { PurchasedPackageServicesModule } from './purchased-package-services/purchased-package-services.module';
import { PurchasedDealServicesModule } from './purchased-deal-services/purchased-deal-services.module';
import { ReportsModule } from './reports/reports.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './firebase-web-notification/notification.module';
import { AuthsModule } from './auths/auths.module';
import { InventoryItemsModule } from './inventory-items/inventory-items.module';
import { PurchasedOrderModule } from './purchased-order/purchased-order.module';
import { GoodReceiptNoteModule } from './good_receipt_note/good_receipt_note.module';
import { VendorsModule } from './vendors/vendors.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: config.get<string>('EMAIL'),
            pass: config.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: config.get<string>('EMAIL'),
        },
      }),
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
    AddServicesIntoCartModule,
    WebhooksModule,
    PurchasedPackagesModule,
    PurchasedPackageServicesModule,
    PurchasedDealServicesModule,
    ReportsModule,
    RazorpayModule,
    NotificationsModule,
    MailModule,
    AuthsModule,
    InventoryItemsModule,
    PurchasedOrderModule,
    GoodReceiptNoteModule,
    VendorsModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGateway],
})
export class AppModule { }
