import { Skill } from "../interfaces/skill.interface"

export class CreateCurriculumDto {
  name: string
  cpf: string
  bornDate: string
  email: string
  phone: string
  education: string
  function: string
  skills: Skill[]
  status: string
  accessKey: string
}
