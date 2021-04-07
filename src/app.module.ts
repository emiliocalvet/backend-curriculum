import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { CurriculumsModule } from './curriculums/curriculums.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    CurriculumsModule,
  ]
})
export class AppModule { }
