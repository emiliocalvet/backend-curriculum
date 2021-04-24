import {Injectable, UnauthorizedException} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {PassportStrategy} from '@nestjs/passport'
import {Strategy, ExtractJwt} from 'passport-jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload
    const user = this.userModel.findOne({ username })
    if(!user){
      throw new UnauthorizedException()
    }
    return user
  }
}
