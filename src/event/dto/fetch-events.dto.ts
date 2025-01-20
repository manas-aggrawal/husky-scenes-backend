import { IsOptional, IsString } from 'class-validator';

export class FetchEventsQueryDTO {
  @IsString()
  @IsOptional()
  public search?: string;

  @IsString()
  @IsOptional()
  public tags?: string[];
}
