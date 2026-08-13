import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './schemas/country.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SellersModule } from '../sellers/sellers.module';
import { LogisticsModule } from '../logistics/logistics.module';
import { AuditLogModule } from '../audit/audit-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    SellersModule,
    LogisticsModule,
    AuditLogModule,
  ],
  providers: [CountriesService, ProductsService],
  controllers: [CountriesController, ProductsController],
  exports: [CountriesService, ProductsService, MongooseModule],
})
export class CatalogModule {}
