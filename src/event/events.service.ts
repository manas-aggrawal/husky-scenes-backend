import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
    console.log('🚀 ~ EventsService ~ user:', user);
    const organizer = await this.userModel.findOne({ _id: user?.id });
    console.log('🚀 ~ EventsService ~ organizer:', organizer);
    const createdEvent: Event = await this.eventModel.create({
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      tags: event.tags,
      location: event.location,
      organizer: user.id,
    });

    return {
      id: createdEvent._id as string,
      name: createdEvent.name,
      description: createdEvent.description,
      tags: createdEvent.tags,
      date: createdEvent.date,
      location: createdEvent.location,
      category: createdEvent.category,
      organizer,
    };
  }

  /**
   * Method to fetch all events
   * @param user - user for which we are fetching events
   * @returns
   */
  public async fetchEvents(user: RequestUser, query: FetchEventsQueryDTO) {
    const { search, tags } = query;
    const userId = user?.id;

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
      .populate('organizer', 'id firstName lastName nuid email role')
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
      attending: e.attendees.includes(new mongoose.Types.ObjectId(userId)),
    }));
  }

  /**
   * Method to fetch event details
   * @param user - User object in request
   * @param query - it contains event id
   * @returns Event
   */
  public async eventDetail(user: RequestUser, param: EventDetailsDTO) {
    const { id } = param;
    const event = await this.eventModel
      .findOne({
        _id: id,
      })
      .select(
        '_id name description location category tags date organizer attendees',
      )
      .populate('organizer', 'id firstName lastName nuid email role')
      .exec();

    return {
      id: event._id,
      name: event.name,
      description: event.description,
      category: event.category,
      location: event.location,
      date: event.date,
      organizer: event.organizer,
      attendees: event.attendees,
      attending: event.attendees.includes(new mongoose.Types.ObjectId(user.id)),
    };
  }
}
