import { EventTags } from 'src/common/enums';
import { User } from 'src/user/user.schema';

export type EventResponse = {
  id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  organizer: User;
  tags: EventTags[];
};
