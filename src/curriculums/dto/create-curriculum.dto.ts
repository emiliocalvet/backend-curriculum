import { IsNotEmpty, IsEmail, MinLength, MaxLength, IsString } from 'class-validator'
import { Skill } from "../interfaces/skill.interface"

export class CreateCurriculumDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  cpf: string

  // @IsDate()
  bornDate: Date

  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  phone: string

  @IsNotEmpty()
  @IsString()
  education: string

  @IsNotEmpty()
  @IsString()
  function: string

  @IsNotEmpty()
  skills: Skill[]

  status: string

  @MinLength(3)
  @MaxLength(20)
  accessKey: string
}
