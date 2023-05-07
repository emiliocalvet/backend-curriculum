import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumStatusDto } from './dto/update-curriculum.dto';
import { CurriculumStatus } from './enums/curriculum-status.enum';
import { EducationCount } from './interfaces/education-count.interface';
import { StatusCount } from './interfaces/status-count.interface';
import { Curriculum, CurriculumDocument } from './schemas/curriculum.schema';

@Injectable()
export class CurriculumsService {
  constructor(
    @InjectModel(Curriculum.name)
    private readonly curriculumModel: Model<CurriculumDocument>,
  ) {}

  private logger = new Logger('CurriculumsService');

  async findAll(): Promise<Curriculum[]> {
    try {
      return this.curriculumModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to find curriculums');
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string): Promise<Curriculum> {
    try {
      return await this.curriculumModel.findById(id);
    } catch (error) {
      this.logger.error(
        `Failed to find curriculum with id = ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async findByKey(accessKey: string): Promise<Curriculum> {
    try {
      return await this.curriculumModel.findOne({ accessKey });
    } catch (error) {
      this.logger.error(
        `Failed to find curriculum with key = ${accessKey}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async countByStatus(): Promise<StatusCount> {
    try {
      const waiting = await this.curriculumModel.countDocuments({
        status: 'AGUARDANDO',
      });
      const approved = await this.curriculumModel.countDocuments({
        status: 'APROVADO',
      });
      const repproved = await this.curriculumModel.countDocuments({
        status: 'REPROVADO',
      });
      const statusCount: StatusCount = {
        waiting,
        approved,
        repproved,
      };
      return statusCount;
    } catch (error) {
      this.logger.error('Failed to count curriculum by status', error.stack);
      throw new InternalServerErrorException();
    }
  }

  async countByEducation(): Promise<EducationCount> {
    try {
      const illiterate = await this.curriculumModel.countDocuments({
        education: 'Analfabeto',
      });
      const complete_fundamental = await this.curriculumModel.countDocuments({
        education: 'Fundamental',
      });
      const incomplete_medium = await this.curriculumModel.countDocuments({
        education: 'Médio Incompleto',
      });
      const complete_medium = await this.curriculumModel.countDocuments({
        education: 'Médio Completo',
      });
      const incomplete_higher = await this.curriculumModel.countDocuments({
        education: 'Superior Incompleto',
      });
      const graduated = await this.curriculumModel.countDocuments({
        education: 'Superior Completo',
      });
      const master_degree = await this.curriculumModel.countDocuments({
        education: 'Mestrado',
      });
      const doctorate_degree = await this.curriculumModel.countDocuments({
        education: 'Doutorado',
      });
      const ignored = await this.curriculumModel.countDocuments({
        education: 'Ignorado',
      });
      const educationCount: EducationCount = {
        illiterate,
        complete_fundamental,
        incomplete_medium,
        complete_medium,
        incomplete_higher,
        graduated,
        master_degree,
        doctorate_degree,
        ignored,
      };
      return educationCount;
    } catch (error) {
      this.logger.error('Failed to count curriculum by education', error.stack);
      throw new InternalServerErrorException();
    }
  }

  async create(createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
    const { accessKey } = createCurriculumDto;
    const existentCurriculum = await this.findByKey(accessKey);
    if (existentCurriculum) {
      throw new ConflictException(
        `Curriculum with accesssKey = '${accessKey}' already exist`,
      );
    }
    try {
      createCurriculumDto.status = CurriculumStatus.WAITING;
      const createdCurriculum = new this.curriculumModel(createCurriculumDto);
      return await createdCurriculum.save();
    } catch (error) {
      this.logger.error('Failed to create curriculum', error.stack);
      throw new InternalServerErrorException();
    }
  }

  async updateStatus(
    id: string,
    updateCurriculumStatusDto: UpdateCurriculumStatusDto,
  ): Promise<Curriculum> {
    try {
      await this.curriculumModel.updateOne(
        { _id: id },
        updateCurriculumStatusDto,
      );
      return this.findById(id);
    } catch (error) {
      this.logger.error(
        `Failed to update curriculum with id = ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.curriculumModel.deleteOne({ _id: id }).exec();
    } catch (error) {
      this.logger.error(
        `Failed to delete curriculum with id = ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
