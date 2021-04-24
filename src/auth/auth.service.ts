import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = await this.findUserByUsername(authCredentialsDto.username)

    if (user) {
      throw new ConflictException(`Username ${user.username} already exists`)
    } else {
      await this.createNewUser(authCredentialsDto)
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentialsDto)

    if (!username) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload: JwtPayload = { username }
    const accessToken = this.jwtService.sign(payload)
    return { accessToken }
  }

  private async createNewUser(authCredentialsDto: AuthCredentialsDto) {
    try {
      const { username, password } = authCredentialsDto
      const user = new User()
      user.username = username
      user.salt = await bcrypt.genSalt()
      user.password = await this.hashPassword(password, user.salt)
      const createdUser = await this.userModel.create(user)
      await createdUser.save()
    } catch (_) {
      throw new InternalServerErrorException()
    }
  }

  private async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto
    const user = await this.findUserByUsername(username)

    if (user && await this.validatePassword(password, user.password, user.salt)) {
      return user.username
    } else {
      return null
    }
  }

  private async findUserByUsername(username: string): Promise<User> {
    try {
      return await this.userModel.findOne({ username })
    } catch (_) {
      throw new InternalServerErrorException()
    }
  }

  private async validatePassword(password: string, hashPassword: string, salt: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, salt)
    return hash === hashPassword
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    try {
      return await bcrypt.hash(password, salt)
    } catch (_) {
      throw new InternalServerErrorException()
    }
  }
}
