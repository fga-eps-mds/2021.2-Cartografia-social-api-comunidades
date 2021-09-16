import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QuestionService } from './questionario.service';
import { SendSurveyAnswersDto } from './dto/sendSurveyAsnwers.dto';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @MessagePattern('sendAnswers')
  async create(@Payload() sendAnswers: SendSurveyAnswersDto) {
    const response = await this.questionService.saveAnswer(sendAnswers);
    return response.id;
  }

  @MessagePattern('getQuestionsToCreateCommunity')
  async getQuestionsToCreateCommunity() {
    return this.questionService.getQuestionsToCreateCommunity();
  }

  @MessagePattern('getQuestionsToGetHelp')
  async getHelpQuestions() {
    return this.questionService.getHelpQuestions();
  }
}
