import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendSurveyAnswersDto } from './dto/sendSurveyAsnwers.dto';
import { QuestionDocument } from './entities/questionario.schema';
import {
  SurveyResponse,
  SurveyResponseDocument,
} from './entities/survey_response.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(SurveyResponse.name)
    private answerModel: Model<SurveyResponseDocument>,

    @InjectModel('surveyQuestions')
    private questionModel: Model<QuestionDocument>,
  ) {}

  async saveAnswer(sendAnswers: SendSurveyAnswersDto) {
    const answer = new this.answerModel(sendAnswers);

    try {
      return await answer.save();
    } catch (err) {
      throw new RpcException(err.message);
    }
  }

  private async getQuestions(formName: string) {
    return this.questionModel
      .find({ formName: formName })
      .sort({ orderInForm: 'ascending' });
  }

  async getQuestionsToCreateCommunity() {
    return this.getQuestions('createCommunity');
  }

  async getHelpQuestions() {
    return this.getQuestions('getHelpForm');
  }
}
