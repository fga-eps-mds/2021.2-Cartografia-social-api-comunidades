import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ComunidadesService } from './comunidades.service';

@Controller()
export class ComunidadesController {
  constructor(private readonly comunidadesService: ComunidadesService) {}

  @MessagePattern('createComunidade')
  create(@Payload() id: string) {
    return this.comunidadesService.create(id);
  }
}
