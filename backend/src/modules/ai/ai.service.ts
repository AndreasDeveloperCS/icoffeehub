import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TasteProfile, TasteProfileDocument } from './schemas/taste-profile.schema';
import { AiConversation, AiConversationDocument } from './schemas/ai-conversation.schema';
import { TasteQuizDto } from './dto/taste-quiz.dto';
import { ProductsService } from '../catalog/products.service';

// v1: deterministic rule-based scoring against the taste quiz answers.
// Doc 15 envisions embeddings + an LLM assistant; this keeps the same
// TasteProfile -> Recommendation contract so a smarter scorer (or an LLM
// re-ranking step) can replace `score()` later without touching callers.
@Injectable()
export class AiService {
  constructor(
    @InjectModel(TasteProfile.name) private tasteProfileModel: Model<TasteProfileDocument>,
    @InjectModel(AiConversation.name) private conversationModel: Model<AiConversationDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async saveQuiz(userId: string, dto: TasteQuizDto) {
    return this.tasteProfileModel
      .findOneAndUpdate({ userId: new Types.ObjectId(userId) }, dto, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
      .exec();
  }

  getProfile(userId: string) {
    return this.tasteProfileModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  private score(product: any, profile: TasteProfile): number {
    let score = 0;
    if (profile.preferredRoastLevels?.includes(product.roastLevel)) score += 3;
    const flavorMatches = (product.flavorNotes || []).filter((f: string) =>
      profile.preferredFlavorNotes?.includes(f),
    ).length;
    score += flavorMatches * 2;
    const avoidMatches = (product.flavorNotes || []).filter((f: string) =>
      profile.avoidFlavorNotes?.includes(f),
    ).length;
    score -= avoidMatches * 3;
    if (product.ratingAverage) score += product.ratingAverage * 0.5;
    return score;
  }

  async getRecommendations(userId: string, limit = 10) {
    const profile = await this.getProfile(userId);
    const products = await this.productsService.listAllActiveForScoring();

    if (!profile) {
      return products
        .sort((a: any, b: any) => b.ratingAverage - a.ratingAverage)
        .slice(0, limit);
    }

    return products
      .map((p) => ({ product: p, score: this.score(p, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.product);
  }

  // Rule-based responder for the "AI Coffee Assistant" chat wireframe (doc 06/15).
  // Keyword-matches into troubleshooting / equipment / recommendation tracks.
  // Structured so a real LLM call can replace `buildReply` without touching
  // the conversation persistence or controller contract.
  private buildReply(message: string): string {
    const m = message.toLowerCase();

    if (/(bitter|harsh|astringent)/.test(m)) {
      return "Bitterness usually points to over-extraction — try a coarser grind, a shorter brew time, or slightly cooler water (92-94°C). If you're using an espresso machine, pull the shot a few seconds shorter.";
    }
    if (/(sour|sharp|acidic|watery|weak)/.test(m)) {
      return 'Sour or weak coffee is often under-extraction — try a finer grind, a longer brew time, or hotter water (94-96°C), and double-check your coffee-to-water ratio (around 1:16 is a good starting point).';
    }
    if (/(grinder|burr|blade)/.test(m)) {
      return "For consistent extraction, a burr grinder beats a blade grinder every time — it gives uniform particle size, which is the biggest single upgrade most home setups can make. Check the Equipment section of the marketplace for options.";
    }
    if (/(scale|ratio|dose)/.test(m)) {
      return 'A basic gram scale makes the biggest difference in consistency. Start at a 1:16 coffee-to-water ratio (e.g. 20g coffee to 320g water) and adjust to taste from there.';
    }
    if (/(recommend|suggest|what should i (buy|try|drink))/.test(m)) {
      return "I'd love to — take the taste quiz on the AI Assistant page (roast, flavor and body preferences) and I'll match you with coffees from the marketplace. If you've already taken it, check your Recommendations below.";
    }
    if (/(decaf)/.test(m)) {
      return "Looking for decaf? Filter the marketplace by processing method 'Decaf' — Swiss Water and CO2 process decafs tend to preserve flavor best.";
    }
    if (/(origin|country|farm)/.test(m)) {
      return 'Origin says a lot about flavor: African coffees (Ethiopia, Kenya) tend toward bright, fruity, floral notes; Central/South American coffees (Colombia, Guatemala) toward balanced chocolate and nutty notes; Indonesian coffees (Sumatra) toward earthy, full-bodied cups. Check the Coffee Encyclopedia for country pages.';
    }
    return "I'm a rule-based assistant for now (no external AI is connected yet) — I can help with brewing troubleshooting, equipment advice, and pointing you to the taste quiz for personalized recommendations. What's going on with your coffee?";
  }

  async chat(userId: string, message: string) {
    let conversation = await this.conversationModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!conversation) {
      conversation = await this.conversationModel.create({ userId: new Types.ObjectId(userId), messages: [] });
    }

    const reply = this.buildReply(message);
    conversation.messages.push({ role: 'user', content: message, createdAt: new Date() });
    conversation.messages.push({ role: 'assistant', content: reply, createdAt: new Date() });
    await conversation.save();

    return { reply, conversationId: String(conversation._id) };
  }

  async getConversation(userId: string) {
    const conversation = await this.conversationModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    return conversation?.messages ?? [];
  }
}
