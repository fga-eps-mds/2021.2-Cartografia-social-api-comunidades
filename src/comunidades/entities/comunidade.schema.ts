import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommunityDocument = Community & Document;

@Schema()
export class Community {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageUrl?: string;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);

CommunitySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

CommunitySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});
