import { Test, TestingModule } from '@nestjs/testing';
import { QuestionarioController } from './questionario.controller';
import { QuestionarioService } from './questionario.service';

describe('QuestionarioController', () => {
  let controller: QuestionarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionarioController],
      providers: [QuestionarioService],
    }).compile();

    controller = module.get<QuestionarioController>(QuestionarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
