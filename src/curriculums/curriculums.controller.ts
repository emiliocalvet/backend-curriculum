import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CurriculumsService } from './curriculums.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumStatusDto } from './dto/update-curriculum.dto';
import { CurriculumStatusValidationPipe } from './pipes/curriculum-status-validation.pipe';
import { Curriculum } from './schemas/curriculum.schema';

@Controller('curriculums')
export class CurriculumsController {
  constructor(private readonly curriculumService: CurriculumsService) { }

  private logger = new Logger('CurriculumController')

  //Return all saved curriculums.
  @Get()
  findAll(): Promise<Curriculum[]> {
    this.logger.verbose('Getting all curriculums')
    return this.curriculumService.findAll()
  }

  //Return a curriculum with a specific id.
  @Get(':id')
  findById(@Param('id') id: string): Promise<Curriculum> {
    this.logger.verbose(`Getting curriculum with id = ${id}`)
    return this.curriculumService.findById(id)
  }

  //Return a curriculum with specific key.
  @Get('/key/:key')
  findByKey(@Param('key') key: string): Promise<Curriculum> {
    this.logger.verbose(`Getting curriculum with key = ${key}`)
    return this.curriculumService.findByKey(key)
  }

  //Create and save a new curriculum.
  @Post()
  create(@Body(ValidationPipe) createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
    this.logger.verbose(`Creating a curriculum with key = ${createCurriculumDto.accessKey}`)
    return this.curriculumService.create(createCurriculumDto)
  }

  //Update status propertie from curriculum.
  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body(CurriculumStatusValidationPipe) updateCurriculumDto: UpdateCurriculumStatusDto
  ): Promise<Curriculum> {
    return this.curriculumService.updateStatus(id, updateCurriculumDto)
  }

  //Delete a project with specific id.
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    this.logger.verbose(`Deleting a curriculum with id = ${id}`)
    return this.curriculumService.delete(id)
  }
}
