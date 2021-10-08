import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SendSurveyAnswersDto } from '../../src/questionario/dto/sendSurveyAsnwers.dto';
import { SurveyResponse } from '../../src/questionario/entities/survey_response.schema';
import { QuestionService } from '../../src/questionario/questionario.service';

describe('QuestionService', () => {
  let service: QuestionService;

  const createCommunityQuestions = [
    {
      id: '1',
      question: 'Nome completo',
      formName: 'createCommunity',
      fieldType: 'textField',
      placeholder: 'Digite sua resposta...',
      validationRegex: '.+',
      errorMessage: 'O campo não pode estar em branco',
      optional: false,
      orderInForm: '1',
    },
    {
      id: '3',
      question: 'Idade',
      formName: 'createCommunity',
      fieldType: 'textField',
      placeholder: 'Digite sua resposta...',
      validationRegex: '.+',
      errorMessage: 'O campo não pode estar em branco',
      optional: true,
      orderInForm: '2',
    },
  ];
  const getHelpQuestions = [
    {
      id: '2',
      question: 'Nome completo',
      formName: 'getHelpForm',
      fieldType: 'textField',
      placeholder: 'Digite sua resposta...',
      validationRegex: '.+',
      errorMessage: 'O campo não pode estar em branco',
      optional: false,
      orderInForm: '1',
    },
  ];

  const defaultData = [...createCommunityQuestions, ...getHelpQuestions];

  beforeEach(async () => {
    function mockSurveyResponseModel(dto: any) {
      this.data = dto;
      this.save = () => {
        if (this.data === null) {
          throw new Error('Field cannot be null');
        }

        return this.data;
      };
      this.answers = dto['answers'];
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
            findOne: (data) => {
              return defaultData.filter((element) => {
                return element['id'] === data['id'];
              })[0];
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
    const answerData = <SendSurveyAnswersDto>{
      answers: [
        {
          questionId: '1',
          response: 'Joao',
        },
        {
          questionId: '2',
          response: 'Ricardo',
        },
      ],
    };

    expect(await service.saveAnswer(answerData)).toStrictEqual(answerData);
  });

  it('should fail regex', async () => {
    const answerData = <SendSurveyAnswersDto>{
      answers: [
        {
          questionId: '1',
          response: '',
        },
      ],
    };

    try {
      await service.saveAnswer(answerData);
    } catch (error) {
      expect(error).toBeInstanceOf(RpcException);
    }
  });

  it('should fail non-optional field validation', async () => {
    const answerData = <SendSurveyAnswersDto>{
      answers: [
        {
          questionId: '3',
          response: '25',
        },
      ],
    };

    try {
      await service.saveAnswer(answerData);
    } catch (error) {
      expect(error).toBeInstanceOf(RpcException);
    }
  });

  it('should raise exception', async () => {
    const answerData: SendSurveyAnswersDto = null;

    try {
      await service.saveAnswer(answerData);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  it('should return create community questions', async () => {
    expect(await service.getQuestionsToCreateCommunity()).toStrictEqual(
      createCommunityQuestions,
    );
  });

  it('should return get help questions', async () => {
    expect(await service.getHelpQuestions()).toStrictEqual(getHelpQuestions);
  });
});
