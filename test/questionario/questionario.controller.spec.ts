import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { SendSurveyAnswersDto } from 'src/questionario/dto/sendSurveyAsnwers.dto';
import { SurveyResponse } from '../../src/questionario/entities/survey_response.schema';
import { QuestionController } from '../../src/questionario/questionario.controller';
import { QuestionService } from '../../src/questionario/questionario.service';

describe('QuestionController', () => {
  let controller: QuestionController;

  const customModule = (fn: any) => {
    return Test.createTestingModule({
      providers: [
        {
          provide: QuestionService,
          useValue: fn,
        },
        {
          provide: getModelToken(SurveyResponse.name),
          useValue: jest.fn(),
        },
        {
          provide: getModelToken('surveyQuestions'),
          useValue: jest.fn(),
        },
      ],
      controllers: [QuestionController],
    }).compile();
  };

  it('should be defined', async () => {
    const module = await customModule(jest.fn());

    controller = module.get<QuestionController>(QuestionController);

    expect(controller).toBeDefined();
  });

  it('should save answers', async () => {
    const questions: SendSurveyAnswersDto = {
      answers: [
        {
          questionId: '1',
          response: 'Nome',
        },
        {
          questionId: '2',
          response: 'Comunidade',
        },
      ],
    };

    const module = await customModule({
      saveAnswer: () =>
        Promise.resolve({
          id: '123',
        }),
    });

    controller = module.get<QuestionController>(QuestionController);

    expect(await controller.create(questions)).toBe('123');
  });

  it('should get questions', async () => {
    const questions = [
      {
        id: '1',
        question: 'Nome',
      },
      {
        id: '2',
        question: 'Comunidade',
      },
    ];

    const module = await customModule({
      getQuestionsToCreateCommunity: () => Promise.resolve(questions),
    });

    controller = module.get<QuestionController>(QuestionController);

    expect(await controller.getQuestionsToCreateCommunity()).toStrictEqual(
      questions,
    );
  });
});
