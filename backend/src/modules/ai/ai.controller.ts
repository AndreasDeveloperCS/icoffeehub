import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { TasteQuizDto } from './dto/taste-quiz.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('taste-quiz')
  saveQuiz(@CurrentUser() user: AuthUser, @Body() dto: TasteQuizDto) {
    return this.aiService.saveQuiz(user.userId, dto);
  }

  @Get('taste-quiz')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.aiService.getProfile(user.userId);
  }

  @Get('recommendations')
  getRecommendations(@CurrentUser() user: AuthUser) {
    return this.aiService.getRecommendations(user.userId);
  }

  @Post('chat')
  chat(@CurrentUser() user: AuthUser, @Body('message') message: string) {
    return this.aiService.chat(user.userId, message);
  }

  @Get('chat')
  getChatHistory(@CurrentUser() user: AuthUser) {
    return this.aiService.getConversation(user.userId);
  }
}
