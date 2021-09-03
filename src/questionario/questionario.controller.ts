import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QuestionarioService } from './questionario.service';
import { CreateQuestionarioDto } from './dto/create-questionario.dto';
import { UpdateQuestionarioDto } from './dto/update-questionario.dto';

@Controller()
export class QuestionarioController {
  constructor(private readonly questionarioService: QuestionarioService) {}

  @MessagePattern('createQuestionario')
  create(@Payload() createQuestionarioDto: CreateQuestionarioDto) {
    return this.questionarioService.create(createQuestionarioDto);
  }

  @MessagePattern('findAllQuestionario')
  findAll() {
    return this.questionarioService.findAll();
  }

  @MessagePattern('findOneQuestionario')
  findOne(@Payload() id: number) {
    return this.questionarioService.findOne(id);
  }

  @MessagePattern('updateQuestionario')
  update(@Payload() updateQuestionarioDto: UpdateQuestionarioDto) {
    return this.questionarioService.update(updateQuestionarioDto.id, updateQuestionarioDto);
  }

  @MessagePattern('removeQuestionario')
  remove(@Payload() id: number) {
    return this.questionarioService.remove(id);
  }
}
