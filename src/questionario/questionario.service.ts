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

  private async validateAnswer(surveyResponse: SurveyResponseDocument) {
    const errors: string[] = [];
    const sentFields = new Set<string>();

    let formName: string = null;

    // verify regex
    for (const answer of surveyResponse.answers) {
      const question = await this.questionModel.findOne({
        id: answer.questionId,
      });
      const regex = new RegExp(question.validationRegex);
      sentFields.add(question.id);

      formName = formName || question.formName;

      if (!regex.test(answer.response)) {
        errors.push(`(${question.question}): ${question.errorMessage}`);
      }
    }

    // verify if all non-optional fields are present
    const nonOptionalFormQuestions = await (
      await this.getQuestions(formName)
    ).filter((elem) => {
      return elem.optional === false;
    });

    for (const nonOptionalQuestion of nonOptionalFormQuestions) {
      if (!sentFields.has(nonOptionalQuestion.id)) {
        errors.push('Questionário incompleto');
        break;
      }
    }

    if (errors.length > 0) {
      throw new RpcException(errors.join('\n'));
    }
  }

  async saveAnswer(sendAnswers: SendSurveyAnswersDto) {
    const answer = new this.answerModel(sendAnswers);

    try {
      await this.validateAnswer(answer);
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
