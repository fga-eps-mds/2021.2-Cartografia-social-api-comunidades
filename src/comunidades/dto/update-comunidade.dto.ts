import { PartialType } from '@nestjs/mapped-types';
import { CreateComunidadeDto } from './create-comunidade.dto';

export class UpdateComunidadeDto extends PartialType(CreateComunidadeDto) {
  id: number;
}
