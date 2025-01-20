import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { EventDTO } from './dto/create-event.dto';
import { RequestUser } from 'src/user/types/user.type';
import { EventResponse } from './types/event.type';
import { Event } from './events.schema';
import { User } from 'src/user/user.schema';
import { FetchEventsQueryDTO } from './dto/fetch-events.dto';
import { EventDetailsDTO } from './dto/event-details.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * Method to create events; it's only accessible to COMMUNITY
   * @param event - event data
   * @param user - user data from request
   * @returns EventResponse
   */
  public async createEvent(
    event: EventDTO,
    user: RequestUser,
  ): Promise<EventResponse> {
    const organizer = await this.userModel.findOne({ email: user?.email });
    const createdEvent: Event = await this.eventModel.create({
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      tags: event.tags,
      location: event.location,
      organizer: organizer?._id ?? '',
    });

    return {
      id: createdEvent._id as string,
      name: createdEvent.name,
      description: createdEvent.description,
      tags: createdEvent.tags,
      date: createdEvent.date,
      location: createdEvent.location,
      category: createdEvent.category,
      organizer: user.email,
    };
  }

  /**
   * Method to fetch all events
   * @param user - user for which we are fetching events
   * @returns
   */
  public async fetchEvents(user: RequestUser, query: FetchEventsQueryDTO) {
    const { search, tags } = query;
    const userId: Pick<User, '_id'> = await this.userModel
      .findOne({ email: user.email })
      .select('_id');

    const eventsQuery: any = {};
    if (search) {
      eventsQuery.name = { $regex: search, $options: 'i' };
    }
    if (tags) {
      eventsQuery.tags = { $in: tags };
    }
    const events = await this.eventModel
      .find(eventsQuery)
      .select(
        '_id name description category date location organizer attendees tags',
      )
      .populate('organizer', '_id firstName lastName nuid email role')
      .exec();

    return events.map((e) => ({
      id: e._id as string,
      name: e.name,
      description: e.description,
      category: e.category,
      tags: e.tags,
      location: e.location,
      attendees: e.attendees,
      date: e.date,
      organizer: e.organizer,
      attending: e.attendees.includes(userId._id as ObjectId),
    }));
  }

  public async eventDetail(user: RequestUser, query: EventDetailsDTO) {
    const { id } = query;
  }
}
