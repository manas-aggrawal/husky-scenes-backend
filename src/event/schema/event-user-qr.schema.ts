import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EventUserQr extends Document {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Event',
    required: true,
  })
  event: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  qrCode: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const EventUserQrSchema = SchemaFactory.createForClass(EventUserQr);

// Create a composite unique index for `event` and `user`
EventUserQrSchema.index({ event: 1, user: 1 }, { unique: true });

export { EventUserQrSchema };
