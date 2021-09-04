import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QuestionarioService } from './questionario.service';
import { SendSurveyAnswersDto } from './dto/sendSurveyAsnwers.dto';

@Controller()
export class QuestionarioController {
  constructor(private readonly questionarioService: QuestionarioService) {}

  @MessagePattern('sendAnswers')
  async create(@Payload() sendAnswers: SendSurveyAnswersDto) {
    const response = await this.questionarioService.saveAnswer(sendAnswers);
    return response.id;
  }

  @MessagePattern('getQuestionsToCreateCommunity')
  async getQuestionsToCreateCommunity() {
    return await this.questionarioService.getQuestionsToCreateCommunity();
  }
}
