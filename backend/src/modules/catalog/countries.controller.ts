import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll(@Query('originOnly') originOnly?: string) {
    return this.countriesService.findAll(originOnly === 'true');
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.countriesService.findBySlug(slug);
  }
}
