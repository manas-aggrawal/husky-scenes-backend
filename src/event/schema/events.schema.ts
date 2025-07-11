import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EventCategory, EventTags } from 'src/common/enums';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, enum: EventCategory })
  category: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: false, type: [EventTags] })
  tags: EventTags[];

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  organizer: mongoose.Types.ObjectId;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    required: true,
    default: [],
  })
  attendees: mongoose.Types.ObjectId[];

  @Prop({
    required: true,
  })
  rsvpDeadline: Date;

  @Prop({
    required: true,
  })
  maxCapacity: number;

  @Prop({
    required: true,
  })
  seatsLeft: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
