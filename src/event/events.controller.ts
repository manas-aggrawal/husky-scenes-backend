import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { EventsService } from './events.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { EventDTO } from './dto/create-event.dto';
import { FetchEventsQueryDTO } from './dto/fetch-events.dto';
import { RequestUser } from 'src/user/types/user.type';
import { EventDetailsDTO } from './dto/event-details.dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(Role.COMMUNITY)
  public async createEvent(
    @Body() event: EventDTO,
    @Req() req: { user: RequestUser },
  ) {
    return this.eventsService.createEvent(event, req.user);
  }

  @Get()
  @Roles(Role.COMMUNITY, Role.ADMIN, Role.USER)
  public async fetchEvents(
    @Req() req: { user: RequestUser },
    @Query() query: FetchEventsQueryDTO,
  ) {
    return this.eventsService.fetchEvents(req.user, query);
  }

  @Get('/:id/detail')
  @Roles(Role.COMMUNITY, Role.ADMIN, Role.USER)
  public async eventDetail(
    @Req() req: { user: RequestUser },
    @Param() param: EventDetailsDTO,
  ) {
    return this.eventsService.eventDetail(req.user, param);
  }
}
