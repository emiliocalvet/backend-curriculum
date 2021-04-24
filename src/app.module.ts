import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { CurriculumsModule } from './curriculums/curriculums.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    CurriculumsModule,
  ]
})
export class AppModule { }
