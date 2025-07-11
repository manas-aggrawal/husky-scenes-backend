import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { EventCategory, EventTags } from 'src/common/enums';

export class EventDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(EventCategory)
  category: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  rsvpDeadline: Date;

  @IsNumber()
  maxCapacity: number;

  @IsString()
  location: string;

  @IsArray()
  tags: EventTags[];
}
