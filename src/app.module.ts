import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ComunidadesModule } from './comunidades/comunidades.module';

@Module({
  imports: [ConfigModule.forRoot(), ComunidadesModule],
})
export class AppModule {}
