import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ComunidadesModule } from './comunidades/comunidades.module';
import { ConfigService } from './config/configuration';
import { QuestionarioModule } from './questionario/questionario.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(new ConfigService().get('mongo').url),
    ComunidadesModule,
    QuestionarioModule,
  ],
})
export class AppModule {}
