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
            find: (data) => {
              // data == { 'formName': 'createCommunity' }
              let questions = [
                { _id: '1', question: 'Nome', formName: 'createCommunity' },
                { _id: '2', question: 'Nome', formName: 'getHelpForm' }
              ]

              let found = questions.filter((element) => {
                return element['formName'] === data['formName'];
              });

              return found;
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

  it('should return create community questions', async () => {
    expect(await service.getQuestionsToCreateCommunity()).toStrictEqual([
      { _id: '1', question: 'Nome', formName: 'createCommunity' },
    ]);
  });

  it('should return get help questions', async () => {
    expect(await service.getHelpQuestions()).toStrictEqual([
      { _id: '2', question: 'Nome', formName: 'getHelpForm' },
    ]);
  });
});
