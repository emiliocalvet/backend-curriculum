import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumStatusDto } from './dto/update-curriculum.dto';
import { CurriculumStatus } from './interfaces/curriculum-status.enum';
import { Curriculum, CurriculumDocument } from './schemas/curriculum.schema';

@Injectable()
export class CurriculumsService {
  constructor(
    @InjectModel(Curriculum.name) private readonly curriculumModel: Model<CurriculumDocument>
  ) { }

  private logger = new Logger('CurriculumsService')

  async findAll(): Promise<Curriculum[]> {
    try {
      return this.curriculumModel.find().exec()
    } catch (error) {
      this.logger.error('Failed to find curriculums')
      throw new InternalServerErrorException()
    }
  }

  async findById(id: string): Promise<Curriculum> {
    try {
      return await this.curriculumModel.findById(id)
    } catch (error) {
      this.logger.error(`Failed to find curriculum with id = ${id}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async findByKey(accessKey: string): Promise<Curriculum> {
    try {
      return await this.curriculumModel.findOne({ accessKey })
    } catch (error) {
      this.logger.error(`Failed to find curriculum with key = ${accessKey}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async create(createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
    try {
      createCurriculumDto.status = CurriculumStatus.WAITING
      const createdCurriculum = new this.curriculumModel(createCurriculumDto)
      return await createdCurriculum.save()
    } catch (error) {
      this.logger.error('Failed to create curriculum', error.stack)
      throw new InternalServerErrorException()
    }
  }

  async updateStatus(
    id: string, updateCurriculumStatusDto: UpdateCurriculumStatusDto
  ): Promise<Curriculum> {
    try {
      await this.curriculumModel.updateOne({ _id: id }, updateCurriculumStatusDto)
      return this.findById(id)
    } catch (error) {
      this.logger.error(`Failed to update curriculum with id = ${id}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.curriculumModel.deleteOne({ _id: id }).exec()
    } catch (error) {
      this.logger.error(`Failed to delete curriculum with id = ${id}`, error.stack)
      throw new InternalServerErrorException()
    }
  }
}
