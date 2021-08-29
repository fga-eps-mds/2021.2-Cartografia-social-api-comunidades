import { Injectable } from '@nestjs/common';
import { CreateComunidadeDto } from './dto/create-comunidade.dto';
import { UpdateComunidadeDto } from './dto/update-comunidade.dto';

@Injectable()
export class ComunidadesService {
  create(createComunidadeDto: CreateComunidadeDto) {
    return 'This action adds a new comunidade';
  }

  findAll() {
    return `This action returns all comunidades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comunidade`;
  }

  update(id: number, updateComunidadeDto: UpdateComunidadeDto) {
    return `This action updates a #${id} comunidade`;
  }

  remove(id: number) {
    return `This action removes a #${id} comunidade`;
  }
}
