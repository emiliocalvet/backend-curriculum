import { BadRequestException, PipeTransform } from "@nestjs/common";
import { CurriculumStatus } from "../interfaces/curriculum-status.enum";

export class CurriculumStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    CurriculumStatus.WAITING,
    CurriculumStatus.APPROVED,
    CurriculumStatus.REPPROVED,
  ]

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status)
    return index !== -1
  }

  transform(value: any) {
    value.status = value.status.toUpperCase()
    if (!this.isStatusValid(value.status))
      throw new BadRequestException(`'${value.status}' is an invalid status`)
    return value
  }
}
