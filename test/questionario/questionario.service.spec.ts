import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponse } from '../../src/questionario/entities/survey_response.schema';
import { QuestionService } from '../../src/questionario/questionario.service';

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(async () => {
    function mockSurveyResponseModel(dto: any) {
      this.data = dto;
      this.save = () => {
        return this.data;
      };
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getModelToken(SurveyResponse.name),
          useValue: mockSurveyResponseModel,
        },
        {
          provide: getModelToken('surveyQuestions'),
          useValue: {
            find: () => {
              return [{ _id: '123123', question: 'Nome' }];
            },
          },
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save answers', async () => {
    const answerData = {
      answers: [
        {
          questionId: '61328169c8b5720156c6fb1e',
          response: 'sdfsdfsdf',
        },
        {
          questionId: '61328169c8b5720156c6fb1e',
          response: 'sdfsdfsdf',
        },
      ],
    };

    expect(await service.saveAnswer(answerData)).toStrictEqual(answerData);
  });

  it('should return questions', async () => {
    expect(await service.getQuestionsToCreateCommunity()).toStrictEqual([
      {
        _id: '123123',
        question: 'Nome',
      },
    ]);
  });
});
