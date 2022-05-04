import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ collection: 'surveyQuestions' })
export class Question {
  @Prop()
  question: string;

  @Prop()
  formName: string;

  @Prop({ enum: ['textField', 'dateField'] })
  fieldType: string;

  @Prop()
  orderInForm: number;

  @Prop()
  validationRegex?: string;

  @Prop()
  placeholder?: string;

  @Prop()
  errorMessage?: string;

  @Prop({ default: false })
  optional: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

QuestionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.orderInForm;
  },
});
