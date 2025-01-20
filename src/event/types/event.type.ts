import { EventTags } from 'src/common/enums';

export type EventResponse = {
  id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  organizer: string;
  tags: EventTags[];
};
