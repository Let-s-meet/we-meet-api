import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/orm/user.entity';
import { MeetCreationDto } from './dto/meet-creation.dto';
import { MeetPaginatedResultsDto } from './dto/meet-paginated-results.dto';
import { MeetPaginationDto } from './dto/meet-pagination.dto';
import { MeetStatus } from './enum/meet-status.enum';
import { MeetsService } from './meets.service';
import { Meet } from './orm/meet.entity';
import { MeetStatusValidationPipe } from './pipes/meet-status-validation.pipe';

@Controller('meets')
@UseGuards(AuthGuard())
export class MeetsController {
  constructor(private meetService: MeetsService) {}
    const MY_SLACK_TOKEN = 'xapp-1-IEMF8IMY1OQ-4089076260459-85c370b433e345de369c4ef5abdf41253519266982439a75af74a3d68d543fb9'

  @Get()
  getMeets(
    @Query(ValidationPipe) filterDto: MeetPaginationDto,
  ): Promise<MeetPaginatedResultsDto> {
    return this.meetService.getMeets(filterDto);
  }

  @Get('/:id')
  getMeetById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Meet> {
    return this.meetService.getMeetById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createMeet(
    @Body() meetCreationDto: MeetCreationDto,
    @GetUser() user: User,
  ): Promise<Meet> {
    return this.meetService.createMeet(meetCreationDto, user);
  }

  @Get('/:id/join')
  joinMeet(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @GetUser() user: User,
  ) {
    return this.meetService.joinMeet(id, user);
  }

  @Get('/:id/leave')
  leaveMeet(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @GetUser() user: User,
  ) {
    return this.meetService.leaveMeet(id, user);
  }

  @Patch('/:id/status')
  updateMeetStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body('status', MeetStatusValidationPipe) status: MeetStatus,
  ): Promise<Meet> {
    return this.meetService.updateMeetStatus(id, status);
  }
}
