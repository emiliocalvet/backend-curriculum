import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Skill } from '../interfaces/skill.interface'

export type CurriculumDocument = Curriculum & Document

@Schema()
export class Curriculum{
  @Prop({required: true})
  name: string

  @Prop({required: true})
  cpf: string

  @Prop({required: true})
  bornDate: string

  @Prop({required: true})
  email: string

  @Prop({required: true})
  phone: string

  @Prop({required: true})
  education: string

  @Prop({required: true})
  function: string

  @Prop({required: true})
  skills: Skill[]

  @Prop({required: true})
  status: string

  @Prop({required: true})
  accessKey: string
}

export const CurriculumSchema = SchemaFactory.createForClass(Curriculum)
