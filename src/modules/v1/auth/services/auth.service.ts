import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginI } from 'src/interfaces/login.interface';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../users/entities/users.entity';
import { UserService } from '../../users/services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { Helpers } from 'src/helpers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  /**
   * generate jwt token
   */
  generateToken(user: UserEntity) {
    return this.jwtService.sign({
      sub: user.id,
    });
  }

  /**
   * register new user
   * @param createUserPayload - object containing user details
   * @returns - object
   */
  async register(createUserPayload: CreateUserDto): Promise<object> {
    const {
      firstname,
      lastname,
      username,
      gender,
      email,
      password,
      phone_number,
      confirmPassword,
    } = createUserPayload;

    try {
      // check if email exists
      if (await this.userService.findByEmailQuery(email)) {
        throw new BadRequestException('User with this email already exists');
      }

      // check if username exists
      if (await this.userService.findByUsernameQuery(username)) {
        throw new BadRequestException(
          'username already taken , try another username',
        );
      }

      if (password != confirmPassword) {
        throw new BadRequestException(
          'Password and confirm Password do not match ',
        );
      }

      delete createUserPayload.confirmPassword;
      let result = await this.userRepository.save({
        ...createUserPayload,
        password: await Helpers.hashPassword(createUserPayload.password),
      });

      delete result.password;
      return {
        status: 'success',
        data: result,
      };
    } catch (e) {
      if (e) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  /**
   *  validate credentials for login
   */
  async validateCredentials(email: string, password: string) {
    try {
      let user = await this.userService.findByEmailQuery(email);

      if (!user) throw new NotFoundException('No user found with this email');

      // compare passwords
      if (!(await Helpers.validatePassword(password, user.password))) {
        throw new BadRequestException('Invalid Credentials');
      }

      delete user.password;
      return user;
    } catch (e) {
      throw e;
    }
  }

  /**
   * User login
   */
  async login(email: string, password: string): Promise<LoginI> {
    try {
      let user = await this.validateCredentials(email, password);
      let token = this.generateToken(user);

      return {
        user,
        token,
      };
    } catch (e) {
      throw e;
    }
  }

  // reset password
  // async changePassword(resetPasswordPayload: ResetPasswordDto) {
  //   let { otp, email, password, confirmPassword } = resetPasswordPayload;

  //   // validate password and confirmPassword

  //   if (password != confirmPassword) {
  //     throw new BadRequestException(
  //       'password and confirm password do not match',
  //     );
  //   }

  //   // validate otp and email matches
  //   let validateOtp = await this.otpService.findOneByValueAndEmailQuery(
  //     otp,
  //     email,
  //   );

  //   if (!validateOtp) {
  //     throw new UnprocessableEntityException(
  //       'validation failed for email and otp ',
  //     );
  //   }

  //   try {
  //     // update user password
  //     let user = await this.userService.findByEmailQuery(email);

  //     await this.userRepository.update(user.id, {
  //       password: await Helpers.hashPassword(password),
  //     });

  //     return {
  //       status: 'success',
  //       message: 'password updated successful',
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}
