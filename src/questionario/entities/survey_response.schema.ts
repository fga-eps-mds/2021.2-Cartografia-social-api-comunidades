import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SurveyResponseDocument = SurveyResponse & Document;

type Answer = {
  questionId: string;
  response: string;
};

@Schema()
export class SurveyResponse {
  @Prop(
    raw([
      {
        questionId: { type: Types.ObjectId, ref: 'Question', required: true },
        response: { type: String, required: true },
      },
    ]),
  )
  answers: Answer[];
}

export const SurveyResponseSchema =
  SchemaFactory.createForClass(SurveyResponse);
