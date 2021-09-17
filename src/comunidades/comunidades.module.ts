import { Module } from '@nestjs/common';
import { ComunidadesService } from './comunidades.service';
import { ComunidadesController } from './comunidades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from './entities/comunidade.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Community.name, schema: CommunitySchema },
    ]),
  ],
  controllers: [ComunidadesController],
  providers: [ComunidadesService],
})
export class ComunidadesModule {}
