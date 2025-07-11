import { IsString } from 'class-validator';

export class EventDetailsDTO {
  @IsString()
  eventId: string;
}
