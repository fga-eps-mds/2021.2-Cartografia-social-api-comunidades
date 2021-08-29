import { Module } from '@nestjs/common';
import { ComunidadesService } from './comunidades.service';
import { ComunidadesController } from './comunidades.controller';

@Module({
  controllers: [ComunidadesController],
  providers: [ComunidadesService],
})
export class ComunidadesModule {}
