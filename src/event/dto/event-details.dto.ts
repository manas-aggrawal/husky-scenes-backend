import { IsString } from 'class-validator';

export class EventDetailsDTO {
  @IsString()
  id: string;
}
