import { Test, TestingModule } from '@nestjs/testing';
import { QuestionarioService } from './questionario.service';

describe('QuestionarioService', () => {
  let service: QuestionarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionarioService],
    }).compile();

    service = module.get<QuestionarioService>(QuestionarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
