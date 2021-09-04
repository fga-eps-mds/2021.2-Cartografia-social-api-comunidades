import { Module } from '@nestjs/common';
import { QuestionarioService } from './questionario.service';
import { QuestionarioController } from './questionario.controller';
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
  controllers: [QuestionarioController],
  providers: [QuestionarioService],
})
export class QuestionarioModule {}
