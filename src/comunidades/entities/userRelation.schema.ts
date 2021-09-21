import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Community } from './comunidade.schema';

export type UserRelationDocument = UserRelation & Document;

@Schema()
export class UserRelation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  userId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Community.name })
  communityId: string;
}

export const UserRelationSchema = SchemaFactory.createForClass(UserRelation);

UserRelationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserRelationSchema.index(
  { userId: 1, communityId: 1 },
  { unique: true, name: 'uniqueUserPerCommunity' },
);

UserRelationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});
