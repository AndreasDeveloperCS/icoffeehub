import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserSchema } from '../modules/users/schemas/user.schema';
import { SellerCompanySchema, SellerStatus, SellerType } from '../modules/sellers/schemas/seller-company.schema';
import { CountrySchema } from '../modules/catalog/schemas/country.schema';
import { ProductSchema, ProductStatus } from '../modules/catalog/schemas/product.schema';
import { DeliveryZoneSchema } from '../modules/logistics/schemas/delivery-zone.schema';
import { ArticleSchema } from '../modules/content/schemas/article.schema';
import { SubscriptionPlanSchema } from '../modules/subscriptions/schemas/subscription-plan.schema';
import { CouponSchema, CouponType } from '../modules/promotions/schemas/coupon.schema';
import { CarrierSchema } from '../modules/fulfillment/schemas/carrier.schema';
import { RoastLevel, ProcessingMethod, ProductCategory } from '../modules/catalog/enums/coffee.enums';
import { Role } from '../common/enums/role.enum';
import { ARTICLE_META } from './articles/meta';
import { ARTICLES_EN } from './articles/en';
import { ARTICLES_ES } from './articles/es';
import { ARTICLES_PT } from './articles/pt';
import { ARTICLES_FR } from './articles/fr';
import { ARTICLES_EL } from './articles/el';
import { ARTICLES_BG } from './articles/bg';
import { ARTICLES_AR } from './articles/ar';
import { ArticleTranslation } from './articles/types';

const User = mongoose.model('User', UserSchema);
const SellerCompany = mongoose.model('SellerCompany', SellerCompanySchema);
const Country = mongoose.model('Country', CountrySchema);
const Product = mongoose.model('Product', ProductSchema);
const DeliveryZone = mongoose.model('DeliveryZone', DeliveryZoneSchema);
const Article = mongoose.model('Article', ArticleSchema);
const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const Carrier = mongoose.model('Carrier', CarrierSchema);

const COUNTRIES = [
  { name: 'Ethiopia', isoCode: 'ET', region: 'Africa', isCoffeeOrigin: true },
  { name: 'Kenya', isoCode: 'KE', region: 'Africa', isCoffeeOrigin: true },
  { name: 'Colombia', isoCode: 'CO', region: 'South America', isCoffeeOrigin: true },
  { name: 'Brazil', isoCode: 'BR', region: 'South America', isCoffeeOrigin: true },
  { name: 'Guatemala', isoCode: 'GT', region: 'Central America', isCoffeeOrigin: true },
  { name: 'Costa Rica', isoCode: 'CR', region: 'Central America', isCoffeeOrigin: true },
  { name: 'Honduras', isoCode: 'HN', region: 'Central America', isCoffeeOrigin: true },
  { name: 'Panama', isoCode: 'PA', region: 'Central America', isCoffeeOrigin: true },
  { name: 'Indonesia', isoCode: 'ID', region: 'Asia', isCoffeeOrigin: true },
  { name: 'Vietnam', isoCode: 'VN', region: 'Asia', isCoffeeOrigin: true },
  { name: 'Yemen', isoCode: 'YE', region: 'Middle East', isCoffeeOrigin: true },
  { name: 'Rwanda', isoCode: 'RW', region: 'Africa', isCoffeeOrigin: true },
  { name: 'United States', isoCode: 'US', region: 'North America', isCoffeeOrigin: false },
  { name: 'United Kingdom', isoCode: 'GB', region: 'Europe', isCoffeeOrigin: false },
  { name: 'Germany', isoCode: 'DE', region: 'Europe', isCoffeeOrigin: false },
];

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB for seeding...');

  // --- Countries ---
  for (const c of COUNTRIES) {
    await Country.findOneAndUpdate(
      { slug: slugify(c.name) },
      { ...c, slug: slugify(c.name), summary: `Coffee-growing profile and marketplace listings for ${c.name}.` },
      { upsert: true, new: true },
    );
  }
  console.log(`Seeded ${COUNTRIES.length} countries.`);

  // --- Admin user ---
  const adminEmail = 'admin@icoffeehub.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash('Admin123!', 10),
      name: 'iCoffeeHub Admin',
      role: Role.ADMIN,
    });
  }
  console.log(`Admin user ready: ${adminEmail} / Admin123!`);

  // --- Sample sellers ---
  const sellerSeeds = [
    {
      email: 'seller1@icoffeehub.com',
      name: 'Highland Roasters',
      companyName: 'Highland Roasters Co.',
      sellerType: SellerType.ROASTER,
      country: 'US',
      deliveryCountries: ['US', 'GB', 'DE'],
    },
    {
      email: 'seller2@icoffeehub.com',
      name: 'Kaffa Origin Farms',
      companyName: 'Kaffa Origin Farms',
      sellerType: SellerType.FARM,
      country: 'ET',
      deliveryCountries: ['US', 'GB', 'DE', 'ET'],
    },
  ];

  const sellers: any[] = [];
  for (const s of sellerSeeds) {
    let user = await User.findOne({ email: s.email });
    if (!user) {
      user = await User.create({
        email: s.email,
        passwordHash: await bcrypt.hash('Seller123!', 10),
        name: s.name,
        role: Role.SELLER,
      });
    }
    let company = await SellerCompany.findOne({ userId: user._id });
    if (!company) {
      company = await SellerCompany.create({
        userId: user._id,
        companyName: s.companyName,
        slug: slugify(s.companyName),
        sellerType: s.sellerType,
        country: s.country,
        deliveryCountries: s.deliveryCountries,
        status: SellerStatus.APPROVED,
        verified: true,
        commissionRate: 12,
      });
    }
    sellers.push(company);

    for (const country of s.deliveryCountries) {
      await DeliveryZone.findOneAndUpdate(
        { sellerId: company._id, countryCode: country },
        { sellerId: company._id, countryCode: country, flatRate: country === s.country ? 3 : 12, estimatedDays: 7 },
        { upsert: true },
      );
    }
  }
  console.log(`Seeded ${sellers.length} approved sellers (password: Seller123!) with delivery zones.`);

  // --- Sample products ---
  const productSeeds = [
    {
      seller: sellers[0],
      name: 'Ethiopia Yirgacheffe Light Roast',
      originCountry: 'Ethiopia',
      farmName: 'Gedeb Cooperative',
      roastLevel: RoastLevel.LIGHT,
      processingMethod: ProcessingMethod.WASHED,
      flavorNotes: ['floral', 'citrus', 'stone_fruit'],
      altitudeMeters: 1900,
      price: 18,
    },
    {
      seller: sellers[0],
      name: 'Colombia Huila Medium Roast',
      originCountry: 'Colombia',
      farmName: 'Finca La Esperanza',
      roastLevel: RoastLevel.MEDIUM,
      processingMethod: ProcessingMethod.WASHED,
      flavorNotes: ['chocolate', 'caramel', 'nutty'],
      altitudeMeters: 1700,
      price: 16,
    },
    {
      seller: sellers[0],
      name: 'Sumatra Mandheling Dark Roast',
      originCountry: 'Indonesia',
      farmName: 'Lintong Estate',
      roastLevel: RoastLevel.DARK,
      processingMethod: ProcessingMethod.WET_HULLED,
      flavorNotes: ['earthy', 'smoky', 'spice'],
      altitudeMeters: 1400,
      price: 15,
    },
    {
      seller: sellers[0],
      name: 'Guatemala Antigua Medium-Dark',
      originCountry: 'Guatemala',
      farmName: 'Finca El Injerto',
      roastLevel: RoastLevel.MEDIUM_DARK,
      processingMethod: ProcessingMethod.WASHED,
      flavorNotes: ['chocolate', 'spice', 'winey'],
      altitudeMeters: 1600,
      price: 17,
    },
    {
      seller: sellers[1],
      name: 'Yirgacheffe Natural Direct-Trade',
      originCountry: 'Ethiopia',
      farmName: 'Kaffa Highlands',
      roastLevel: RoastLevel.LIGHT,
      processingMethod: ProcessingMethod.NATURAL,
      flavorNotes: ['berry', 'tropical_fruit', 'honey'],
      altitudeMeters: 2000,
      price: 22,
    },
    {
      seller: sellers[1],
      name: 'Sidamo Honey Process',
      originCountry: 'Ethiopia',
      farmName: 'Sidamo Cooperative Union',
      roastLevel: RoastLevel.MEDIUM_LIGHT,
      processingMethod: ProcessingMethod.HONEY,
      flavorNotes: ['honey', 'vanilla', 'stone_fruit'],
      altitudeMeters: 1850,
      price: 20,
    },
    {
      seller: sellers[1],
      name: 'Rwanda Bourbon Washed',
      originCountry: 'Rwanda',
      farmName: 'Musasa Washing Station',
      roastLevel: RoastLevel.MEDIUM,
      processingMethod: ProcessingMethod.WASHED,
      flavorNotes: ['citrus', 'floral', 'caramel'],
      altitudeMeters: 1750,
      price: 19,
    },
    {
      seller: sellers[1],
      name: 'Kenya AA Anaerobic',
      originCountry: 'Kenya',
      farmName: 'Nyeri Estate',
      roastLevel: RoastLevel.MEDIUM_LIGHT,
      processingMethod: ProcessingMethod.ANAEROBIC,
      flavorNotes: ['berry', 'winey', 'tropical_fruit'],
      altitudeMeters: 1800,
      price: 24,
    },
  ];

  for (const p of productSeeds) {
    const slug = slugify(p.name);
    const exists = await Product.findOne({ slug });
    if (exists) continue;
    await Product.create({
      sellerId: p.seller._id,
      name: p.name,
      slug,
      category: ProductCategory.ROASTED_BEANS,
      description: `${p.name} sourced from ${p.farmName}, ${p.originCountry}. Roasted to order and shipped fresh.`,
      originCountry: p.originCountry,
      farmName: p.farmName,
      roastLevel: p.roastLevel,
      processingMethod: p.processingMethod,
      flavorNotes: p.flavorNotes,
      altitudeMeters: p.altitudeMeters,
      roastDate: new Date(),
      photos: [],
      variants: [
        { sku: `${slug}-250g`, weightGrams: 250, price: p.price, currency: 'USD', stock: 50 },
        { sku: `${slug}-1kg`, weightGrams: 1000, price: Math.round(p.price * 3.5), currency: 'USD', stock: 20 },
      ],
      status: ProductStatus.ACTIVE,
      featured: Math.random() > 0.5,
    });
  }
  console.log(`Seeded ${productSeeds.length} products.`);

  // --- Articles ---
  // Two legacy site-specific articles that aren't part of the translated
  // encyclopedia batch below (general intro piece + launch announcement).
  const legacyArticleSeeds = [
    {
      title: 'The Coffee Encyclopedia: Understanding Origin and Terroir',
      type: 'encyclopedia',
      locale: 'en',
      summary: 'How altitude, soil and climate shape flavor in the cup.',
      body: 'Coffee terroir works much like wine terroir: altitude, soil composition, rainfall and shade all influence bean density and flavor development...',
    },
    {
      title: 'iCoffeeHub Launches Global Origin Marketplace',
      type: 'news',
      locale: 'en',
      summary: 'iCoffeeHub connects farms, roasters and coffee lovers worldwide.',
      body: 'Today we are launching the iCoffeeHub marketplace, connecting verified coffee farms and roasters directly with customers worldwide...',
    },
  ];

  for (const a of legacyArticleSeeds) {
    const slug = slugify(a.title);
    await Article.findOneAndUpdate(
      { slug },
      { ...a, slug, status: 'published', publishedAt: new Date() },
      { upsert: true },
    );
  }
  console.log(`Seeded ${legacyArticleSeeds.length} legacy articles.`);

  // --- Encyclopedia: Origins, Brew Guides, Recipes, Courses and News, in every supported language ---
  const TRANSLATIONS_BY_LOCALE: Record<string, ArticleTranslation[]> = {
    en: ARTICLES_EN,
    es: ARTICLES_ES,
    pt: ARTICLES_PT,
    fr: ARTICLES_FR,
    el: ARTICLES_EL,
    bg: ARTICLES_BG,
    ar: ARTICLES_AR,
  };

  let encyclopediaCount = 0;
  for (const [locale, translations] of Object.entries(TRANSLATIONS_BY_LOCALE)) {
    for (const translation of translations) {
      const meta = ARTICLE_META.find((m) => m.translationGroup === translation.translationGroup);
      if (!meta) {
        console.warn(`No metadata found for translationGroup "${translation.translationGroup}" (${locale}) — skipping.`);
        continue;
      }
      // English keeps the clean canonical slug; other languages get a locale suffix
      // so all seven variants of the same article can coexist by unique slug.
      const baseSlug = slugify(translation.title);
      const slug = locale === 'en' ? baseSlug : `${baseSlug}-${locale}`;
      await Article.findOneAndUpdate(
        { slug },
        {
          slug,
          title: translation.title,
          summary: translation.summary,
          body: translation.body,
          type: meta.type,
          countrySlug: meta.countrySlug,
          tags: meta.tags,
          sources: meta.sources,
          locale,
          translationGroup: meta.translationGroup,
          status: 'published',
          publishedAt: new Date(),
        },
        { upsert: true },
      );
      encyclopediaCount += 1;
    }
  }
  console.log(`Seeded ${encyclopediaCount} multilingual encyclopedia articles (${ARTICLE_META.length} topics x ${Object.keys(TRANSLATIONS_BY_LOCALE).length} languages).`);

  // --- Subscription plan ---
  await SubscriptionPlan.findOneAndUpdate(
    { name: 'Monthly Discovery Box' },
    {
      name: 'Monthly Discovery Box',
      description: 'A curated 250g bag from a different origin every month.',
      frequency: 'monthly',
      weightGrams: 250,
      price: 19,
      currency: 'USD',
      active: true,
    },
    { upsert: true },
  );
  console.log('Seeded subscription plan.');

  // --- Coupons ---
  const couponSeeds = [
    { code: 'WELCOME10', type: CouponType.PERCENT, value: 10, minOrderAmount: 0 },
    { code: 'FREESHIP', type: CouponType.FIXED, value: 5, minOrderAmount: 50 },
  ];
  for (const c of couponSeeds) {
    await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true });
  }
  console.log(`Seeded ${couponSeeds.length} coupons.`);

  // --- Carriers ---
  const carrierSeeds = [
    { name: 'DHL Express', trackingUrlTemplate: 'https://www.dhl.com/track?id={trackingNumber}' },
    { name: 'FedEx', trackingUrlTemplate: 'https://www.fedex.com/track?id={trackingNumber}' },
    { name: 'UPS', trackingUrlTemplate: 'https://www.ups.com/track?id={trackingNumber}' },
  ];
  for (const c of carrierSeeds) {
    await Carrier.findOneAndUpdate({ name: c.name }, c, { upsert: true });
  }
  console.log(`Seeded ${carrierSeeds.length} carriers.`);

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
