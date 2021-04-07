import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumStatus } from './dto/update-curriculum.dto';
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
    } catch (_) {
      this.logger.error(`Failed to find curriculum with id = ${id}`)
      throw new InternalServerErrorException()
    }
  }

  async findByKey(key: string): Promise<Curriculum> {
    try {
      return await this.curriculumModel.findOne({ key })
    } catch (_) {
      this.logger.error(`Failed to find curriculum with key = ${key}`)
      throw new InternalServerErrorException()
    }
  }

  async create(createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
    try {
      const createdCurriculum = new this.curriculumModel(createCurriculumDto)
      return await createdCurriculum.save()
    } catch (_) {
      this.logger.error('Failed to create curriculum')
      throw new InternalServerErrorException()
    }
  }

  async updateStatus(
    id: string, updateCurriculumStatus: UpdateCurriculumStatus
  ): Promise<Curriculum> {
    try {
      await this.curriculumModel.updateOne({ _id: id}, updateCurriculumStatus)
      return this.findById(id)
    } catch (error) {
      this.logger.error(`Failed to update curriculum with id = ${id}`)
      throw new InternalServerErrorException()
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.curriculumModel.deleteOne({ _id: id }).exec()
    } catch (_) {
      this.logger.error(`Failed to delete curriculum with id = ${id}`)
      throw new InternalServerErrorException()
    }
  }
}
