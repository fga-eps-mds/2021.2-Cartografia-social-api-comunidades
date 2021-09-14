import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponse } from '../../src/questionario/entities/survey_response.schema';
import { QuestionController } from '../../src/questionario/questionario.controller';
import { QuestionService } from '../../src/questionario/questionario.service';

describe('QuestionController', () => {
  let controller: QuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        QuestionService,
        {
          provide: getModelToken(SurveyResponse.name),
          useValue: () => ({}),
        },
        {
          provide: getModelToken('surveyQuestions'),
          useValue: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
