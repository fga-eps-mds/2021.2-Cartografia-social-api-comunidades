import { Module } from '@nestjs/common';
import { ComunidadesService } from './comunidades.service';
import { ComunidadesController } from './comunidades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from './entities/comunidade.schema';
import {
  UserRelation,
  UserRelationSchema,
} from './entities/userRelation.schema';
import { User, UserSchema } from './entities/user.schema';
import { MailSender } from 'src/providers/mail/sender';
import { ConfigService } from 'src/config/configuration';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Community.name, schema: CommunitySchema },
      { name: UserRelation.name, schema: UserRelationSchema },
      { name: 'userAdminRelation', schema: UserRelationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ComunidadesController],
  providers: [
    ComunidadesService,
    MailSender,
    {
      provide: 'CONFIG',
      useClass: ConfigService,
    },
  ],
})
export class ComunidadesModule {}
