import { Module } from '@nestjs/common';
import { QuestionService } from './questionario.service';
import { QuestionController } from './questionario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SurveyResponse,
  SurveyResponseSchema,
} from './entities/survey_response.schema';
import { QuestionSchema } from './entities/questionario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SurveyResponse.name, schema: SurveyResponseSchema },
      { name: 'surveyQuestions', schema: QuestionSchema },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionarioModule {}
