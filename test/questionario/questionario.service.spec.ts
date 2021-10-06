import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Question } from 'src/questionario/entities/questionario.schema';
import { SurveyResponse } from '../../src/questionario/entities/survey_response.schema';
import { QuestionService } from '../../src/questionario/questionario.service';

describe('QuestionService', () => {
  let service: QuestionService;

  const defaultData = [
    {
      _id: '1',
      question: 'Nome completo',
      formName: 'createCommunity',
      fieldType: 'textField',
      placeholder: 'Digite sua resposta...',
      validationRegex: '/^.{1,}$/',
      errorMessage: 'O campo não pode estar em branco',
      optional: false,
      orderInForm: '1',
    },
    {
      _id: '2',
      question: 'Nome completo',
      formName: 'getHelpForm',
      fieldType: 'textField',
      placeholder: 'Digite sua resposta...',
      validationRegex: '/^.{1,}$/',
      errorMessage: 'O campo não pode estar em branco',
      optional: false,
      orderInForm: '1',
    },
  ];

  beforeEach(async () => {
    function mockSurveyResponseModel(dto: any) {
      this.data = dto;
      this.save = () => {
        if (this.data === null) {
          throw new Error('Field cannot be null');
        }

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
              const result = defaultData.filter((element) => {
                return element['formName'] === data['formName'];
              });

              return {
                ...result,
                sort: () => result,
              };
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

  it('should raise exception', async () => {
    const answerData = null;

    try {
      await service.saveAnswer(answerData);
    } catch (error) {
      expect(error).toBeInstanceOf(RpcException);
    }
  });

  it('should return create community questions', async () => {
    expect(await service.getQuestionsToCreateCommunity()).toStrictEqual([
      defaultData[0],
    ]);
  });

  it('should return get help questions', async () => {
    expect(await service.getHelpQuestions()).toStrictEqual([defaultData[1]]);
  });
});
