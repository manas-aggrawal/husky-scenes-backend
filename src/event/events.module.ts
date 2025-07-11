import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schema/events.schema';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { EventUserQr, EventUserQrSchema } from './schema/event-user-qr.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: EventUserQr.name, schema: EventUserQrSchema },
    ]),
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventModule {}
