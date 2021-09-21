import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRelationDocument = UserRelation & Document;

@Schema()
export class UserRelation {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  communityId: string;
}

export const UserRelationSchema = SchemaFactory.createForClass(UserRelation);

UserRelationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserRelationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});
