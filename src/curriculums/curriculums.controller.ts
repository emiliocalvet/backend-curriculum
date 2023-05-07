import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { CurriculumsService } from './curriculums.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumStatusDto } from './dto/update-curriculum.dto';
import { EducationCount } from './interfaces/education-count.interface';
import { StatusCount } from './interfaces/status-count.interface';
import { CurriculumStatusValidationPipe } from './pipes/curriculum-status-validation.pipe';
import { Curriculum } from './schemas/curriculum.schema';

@Controller('curriculums')
export class CurriculumsController {
  constructor(private readonly curriculumService: CurriculumsService) {}

  private logger = new Logger('CurriculumController');

  // Return all saved curriculums.
  @Get()
  // @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<Curriculum[]> {
    this.logger.verbose('Getting all curriculums');
    return this.curriculumService.findAll();
  }

  // Return a curriculum with a specific id.
  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  findById(@Param('id') id: string): Promise<Curriculum> {
    this.logger.verbose(`Getting curriculum with id = ${id}`);
    return this.curriculumService.findById(id);
  }

  // Return a curriculum with specific key.
  @Get('/key/:key')
  findByKey(@Param('key') key: string): Promise<Curriculum> {
    this.logger.verbose(`Getting curriculum with key = ${key}`);
    return this.curriculumService.findByKey(key);
  }

  // Return number of curriculums by status.
  @Get('/status/count')
  countByStatus(): Promise<StatusCount> {
    this.logger.verbose(`Getting number of curriculums by status`);
    return this.curriculumService.countByStatus();
  }

  // Return number of curriculums by education.
  @Get('/education/count')
  countByEducation(): Promise<EducationCount> {
    this.logger.verbose(`Getting number of curriculum by education`);
    return this.curriculumService.countByEducation();
  }

  // Create and save a new curriculum.
  @Post()
  create(
    @Body(ValidationPipe) createCurriculumDto: CreateCurriculumDto,
  ): Promise<Curriculum> {
    this.logger.verbose(
      `Creating a curriculum with key = ${createCurriculumDto.accessKey}`,
    );
    return this.curriculumService.create(createCurriculumDto);
  }

  // Update status propertie from curriculum.
  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  updateStatus(
    @Param('id') id: string,
    @Body(CurriculumStatusValidationPipe)
    updateCurriculumDto: UpdateCurriculumStatusDto,
  ): Promise<Curriculum> {
    return this.curriculumService.updateStatus(id, updateCurriculumDto);
  }

  // Delete a project with specific id.
  @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string): Promise<void> {
    this.logger.verbose(`Deleting a curriculum with id = ${id}`);
    return this.curriculumService.delete(id);
  }
}
