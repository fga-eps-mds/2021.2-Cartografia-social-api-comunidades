import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ collection: 'surveyQuestions' })
export class Question {
  @Prop()
  question: string;

  @Prop()
  formName: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
