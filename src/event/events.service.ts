import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { EventDTO } from './dto/create-event.dto';
import { RequestUser } from 'src/user/types/user.type';
import { Event } from './schema/events.schema';
import { User } from 'src/user/schema/user.schema';
import { FetchEventsQueryDTO } from './dto/fetch-events.dto';
import { EventDetailsDTO } from './dto/event-details.dto';
import * as QRCode from 'qrcode';
import { EventUserQr } from './schema/event-user-qr.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(EventUserQr.name) private eventUserQrModel: Model<EventUserQr>,
  ) {}

  /**
   * Method to create events; it's only accessible to COMMUNITY
   * @param event - event data
   * @param user - user data from request
   * @returns EventResponse
   */
  public async createEvent(event: EventDTO, user: RequestUser) {
    const organizer = await this.userModel
      .findOne({
        _id: user?._id,
      })
      .select('-password');

    const createdEvent: Event = await this.eventModel.create({
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      rsvpDeadline: event.rsvpDeadline,
      tags: event.tags,
      location: event.location,
      organizer,
      maxCapacity: event.maxCapacity,
      seatsLeft: event.maxCapacity,
    });

    return {
      _id: createdEvent._id as string,
      name: createdEvent.name,
      description: createdEvent.description,
      tags: createdEvent.tags,
      date: createdEvent.date,
      location: createdEvent.location,
      category: createdEvent.category,
      organizer,
      maxCapacity: createdEvent.maxCapacity,
      seatsLeft: createdEvent.maxCapacity,
    };
  }

  /**
   * Method to fetch all events
   * @param user - user for which we are fetching events
   * @returns
   */
  public async fetchEvents(user: RequestUser, query: FetchEventsQueryDTO) {
    const { search, tags } = query;
    const userId = user?._id;

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
        '_id name description category date location organizer attendees tags maxCapacity seatsLeft',
      )
      .populate('attendees', 'firstName lastName')
      .limit(4)
      .populate('organizer', 'firstName lastName email nuid')
      .exec();

    console.log('🚀 ~ EventsService ~ fetchEvents ~ events:', events);

    return events.map((e) => ({
      id: e._id as string,
      name: e.name,
      description: e.description,
      category: e.category,
      tags: e.tags,
      location: e.location,
      attendees: e.attendees,
      date: e.date,
      rsvpDeadline: e.rsvpDeadline,
      organizer: e.organizer,
      attending: e.attendees.includes(new mongoose.Types.ObjectId(userId)),
      maxCapacity: e.maxCapacity,
      seatsLeft: e.seatsLeft,
    }));
  }

  /**
   * Method to fetch event details
   * @param user - User object in request
   * @param query - it contains event id
   * @returns Event
   */
  public async eventDetail(user: RequestUser, param: EventDetailsDTO) {
    const { eventId } = param;

    const event = await this.eventModel
      .findOne({
        _id: eventId,
      })
      .select(
        '_id name description location category tags date organizer attendees maxCapacity seatsLeft',
      )
      .populate('organizer', 'nuid email firstName lastName')
      .populate('attendees', 'firstName lastName')
      .exec();

    return {
      _id: eventId,
      name: event.name,
      description: event.description,
      category: event.category,
      location: event.location,
      date: event.date,
      rsvpDeadline: event.rsvpDeadline,
      organizer: event.organizer,
      attendees: event.attendees.slice(0, 4),
      numOfAttendees: event.attendees.length,
      attending: event.attendees.includes(
        new mongoose.Types.ObjectId(user._id),
      ),
      maxCapacity: event.maxCapacity,
      seatsLeft: event.seatsLeft,
    };
  }

  /**
   * Method to register for an event.
   * @param user - request user
   * @param param - event to rsvp for
   */
  public async registerForEvent(user: RequestUser, param: EventDetailsDTO) {
    const { eventId } = param;
    const [userExists, eventExists] = await Promise.all([
      this.userModel.findOne({ _id: user._id }).select('-password'),
      this.eventModel.findById(eventId),
    ]);

    console.log(
      '🚀 ~ EventsService ~ registerForEvent ~ userExists:',
      userExists,
    );
    if (!eventExists) {
      throw new NotFoundException('Event not found!');
    }
    if (!userExists) {
      throw new NotFoundException('User not found!');
    }

    // Generate QR code
    const qrData = JSON.stringify({
      eventId: eventId,
      userId: user._id,
    });
    console.log('🚀 ~ EventsService ~ registerForEvent ~ qrData:', qrData);

    const qrCode = await QRCode.toDataURL(qrData);
    console.log('🚀 ~ EventsService ~ registerForEvent ~ qrCode:', qrCode);

    await Promise.all([
      this.eventModel.updateOne(
        {
          _id: eventId,
        },
        {
          $push: {
            attendees: user._id,
          },
          $inc: {
            seatsLeft: -1,
          },
        },
      ),
      this.eventUserQrModel.create({
        event: eventId,
        user: user._id,
        qr: qrData,
      }),
    ]);
  }
}
