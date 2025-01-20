import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsString } from 'class-validator';
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

  @IsString()
  location: string;

  @IsArray()
  tags: EventTags[];
}
