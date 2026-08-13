import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasteProfile, TasteProfileSchema } from './schemas/taste-profile.schema';
import { AiConversation, AiConversationSchema } from './schemas/ai-conversation.schema';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TasteProfile.name, schema: TasteProfileSchema },
      { name: AiConversation.name, schema: AiConversationSchema },
    ]),
    CatalogModule,
  ],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
