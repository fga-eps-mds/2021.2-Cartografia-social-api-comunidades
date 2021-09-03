import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ComunidadesService } from './comunidades.service';
import { CreateComunidadeDto } from './dto/create-comunidade.dto';
import { UpdateComunidadeDto } from './dto/update-comunidade.dto';

@Controller()
export class ComunidadesController {
  constructor(private readonly comunidadesService: ComunidadesService) {}

  @MessagePattern('createComunidade')
  create(@Payload() createComunidadeDto: CreateComunidadeDto) {
    return this.comunidadesService.create(createComunidadeDto);
  }

  @MessagePattern('findAllComunidades')
  findAll() {
    return this.comunidadesService.findAll();
  }

  @MessagePattern('findOneComunidade')
  findOne(@Payload() id: number) {
    return this.comunidadesService.findOne(id);
  }

  @MessagePattern('updateComunidade')
  update(@Payload() updateComunidadeDto: UpdateComunidadeDto) {
    return this.comunidadesService.update(
      updateComunidadeDto.id,
      updateComunidadeDto,
    );
  }

  @MessagePattern('removeComunidade')
  remove(@Payload() id: number) {
    return this.comunidadesService.remove(id);
  }
}
