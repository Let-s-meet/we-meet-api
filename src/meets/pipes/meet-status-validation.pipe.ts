import { BadRequestException, PipeTransform } from '@nestjs/common';
import { MeetStatus } from '../enum/meet-status.enum';

export class MeetStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [MeetStatus.ACTIVE, MeetStatus.INACTIVE];
  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
