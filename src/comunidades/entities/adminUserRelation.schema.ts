import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Community } from './comunidade.schema';

export type UserAdminRelationDocument = UserAdminRelation & Document;

@Schema()
export class UserAdminRelation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  userId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Community.name })
  communityId: string;
}

export const UserAdminRelationSchema =
  SchemaFactory.createForClass(UserAdminRelation);

UserAdminRelationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserAdminRelationSchema.index(
  { userId: 1, communityId: 1 },
  { unique: true, name: 'uniqueUserPerCommunity' },
);

UserAdminRelationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});
