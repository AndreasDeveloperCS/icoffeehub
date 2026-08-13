import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';

@Injectable()
export class CountriesService {
  constructor(@InjectModel(Country.name) private countryModel: Model<CountryDocument>) {}

  findAll(originOnly = false) {
    const filter = originOnly ? { isCoffeeOrigin: true } : {};
    return this.countryModel.find(filter).sort({ name: 1 }).exec();
  }

  async findBySlug(slug: string) {
    const country = await this.countryModel.findOne({ slug }).exec();
    if (!country) throw new NotFoundException('Country not found');
    return country;
  }

  upsert(data: Partial<Country> & { slug: string }) {
    return this.countryModel.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true }).exec();
  }
}
