import { Module } from "@nestjs/common";
import { UsersModule } from "./users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Purchase } from "src/entities/purchase.entity";
import { Product } from "src/entities/product.entity";
import { ProductType } from "src/entities/productType.entity";
import { PurchaseProduct } from "src/entities/purchaseProduct.entity";
import { ProductsModule } from "./products.module";
import { ProductsTypeModule } from "./productsType.module";
import { PurchasesModule } from "./purchases.module";
import { PurchaseAddress } from "src/entities/purchaseAddress.entity";
import { City } from "src/entities/city.entity";
import { Country } from "src/entities/country.entity";
import { CountriesModule } from "./country.module";
import { CitiesModule } from "./city.module";
import { PurchaseAddressModule } from "./purchaseAddress.module";
import { ShippingModule } from "./shipping.module";
import { ShippingConfig } from "src/entities/shipping-config.entity";
import { AdminModule } from "./admin.module";
import { ChatModule } from "src/chat/chat.module";
import { Chat } from "src/entities/chat.entity";
import { Message } from "src/entities/messages.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      schema: process.env.DB_SCHEMA || "shop",
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "12345678",
      database: process.env.DB_DATABASE || "postgres",
      entities: [
        User,
        Purchase,
        Product,
        ProductType,
        PurchaseProduct,
        PurchaseAddress,
        City,
        Country,
        ShippingConfig,
        Chat,
        Message
      ],
      logging: true,
      synchronize: false,
      dropSchema: false,
    }),
    UsersModule,
    ProductsModule,
    ProductsTypeModule,
    PurchasesModule,
    CountriesModule,
    CitiesModule,
    PurchaseAddressModule, 
    ShippingModule,
    AdminModule,
    ChatModule,
  ],
})
export class AppModule {}
