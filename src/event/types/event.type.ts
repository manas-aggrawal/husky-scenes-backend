import { EventTags } from 'src/common/enums';
import { User } from 'src/user/schema/user.schema';

export type EventResponse = {
  _id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  organizer: User;
  tags: EventTags[];
  maxCapacity: number;
  seatsLeft: number;
};
