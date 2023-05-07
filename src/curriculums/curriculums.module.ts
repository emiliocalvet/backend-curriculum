import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurriculumsController } from './curriculums.controller';
import { CurriculumsService } from './curriculums.service';
import { Curriculum, CurriculumSchema } from './schemas/curriculum.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Curriculum.name, schema: CurriculumSchema },
    ]),
  ],
  controllers: [CurriculumsController],
  providers: [CurriculumsService],
})
export class CurriculumsModule {}
