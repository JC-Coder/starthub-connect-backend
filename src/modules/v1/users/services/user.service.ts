import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Helpers } from 'src/helpers';
import {
  ImageValidatorMessages,
  ImageValidators,
} from 'src/validators/image.validator';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/services/auth.service';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UserEntity } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // find user by id query
  async findByIdQuery(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  // find user by email query
  async findByEmailQuery(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }

  // find by username query
  async findByUsernameQuery(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { username: username },
    });
  }

  /**
   *  find user by skill / name
   * @param searchString
   * @param options
   * @returns
   */
  async findByUniqueIdOrName(
    searchString: string,
    options: IPaginationOptions,
  ) {
    let result = this.userRepository
      .createQueryBuilder('u')
      .where(
        'u.skills like :searchString or u.firstname like :searchString or u.lastname like :searchString',
        { searchString: `%${searchString}%` },
      );

    return await paginate<UserEntity>(result, options);
  }

  /**
   * find all user paginated
   * @param options
   * @returns
   */
  async findAllPaginated(options: IPaginationOptions) {
    let result = this.userRepository.createQueryBuilder('u');

    return await paginate<UserEntity>(result, options);
  }

  /**
   * get user by id
   */
  async getUser(id: number){
    let user =  await this.findByIdQuery(id);

    if(!user){
      throw new NotFoundException("No user found with supplied id ")
    }

    return user;
  }

  /**
   * update profile
   * @param user
   * @param updateProfilePayload
   * @returns
   */
  async updateProfile(
    user: UserEntity,
    updateProfilePayload: UpdateProfileDto,
  ) {
    // delete empty items from payload
    Object.keys(updateProfilePayload).forEach(
      (k) =>
        updateProfilePayload[k] == '' ||
        (updateProfilePayload[k] == null && delete updateProfilePayload[k]),
    );

    try {
      await this.userRepository.update(user.id, updateProfilePayload);

      return {
        status: 'success',
        message: 'profile updated successful',
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * add / update user profile image
   * @param user
   * @param file
   * @returns - object
   */
  async addOrUpdateProfileImage(user: UserEntity, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file cannot be empty');
    }

    if (!file.filename.match(ImageValidators.Regex)) {
      Helpers.deleteImage(file.filename);
      throw new BadRequestException(ImageValidatorMessages.RegexMessage);
    }

    // delete user previous image if exist
    if (user.profile_image) {
      Helpers.deleteImage(user.profile_image);
    }

    try {
      await this.userRepository.update(user.id, {
        profile_image: file.filename,
      });

      return {
        status: 'success',
        message: 'profile image update successful',
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * add / update user cover image
   * @param user
   * @param file
   * @returns - object
   */
  async addOrUpdateCoverImage(user: UserEntity, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file cannot be empty');
    }

    if (!file.filename.match(ImageValidators.Regex)) {
      Helpers.deleteImage(file.filename);
      throw new BadRequestException(ImageValidatorMessages.RegexMessage);
    }

    // delete user previous image if exist
    if (user.cover_image) {
      Helpers.deleteImage(user.cover_image);
    }

    try {
      await this.userRepository.update(user.id, {
        cover_image: file.filename,
      });

      return {
        status: 'success',
        message: 'cover image update successful',
      };
    } catch (err) {
      if (err) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  /**
   * Change logged in user password
   */
  // async updatePassword(
  //   updatePasswordPayload: UpdatePasswordDto,
  //   user: UserEntity,
  // ): Promise<any> {
  //   this.logger.log('change logged in user password start');

  //   const { oldPassword, newPassword, confirmPassword } = updatePasswordPayload;
  //   let userFromDb = await this.findByEmailQuery(user.email);

  //   if (!userFromDb) {
  //     throw new UnauthorizedException();
  //   }

  //   if (newPassword != confirmPassword) {
  //     throw new BadRequestException(
  //       'new password and confirm password do not match',
  //     );
  //   }

  //   if (!(await Helpers.validatePassword(oldPassword, userFromDb.password))) {
  //     throw new BadRequestException('old password is not correct');
  //   }

  //   if (await Helpers.validatePassword(newPassword, userFromDb.password)) {
  //     throw new BadRequestException(
  //       'old password and new password cannot be the same',
  //     );
  //   }

  //   try {
  //     await this.userRepository.update(userFromDb.id, {
  //       password: await Helpers.hashPassword(newPassword),
  //     });
  //     this.logger.log('change logged in user password success');

  //     return {
  //       status: 'success',
  //       message: 'password updated successfully',
  //     };
  //   } catch (err) {
  //     throw new InternalServerErrorException(err.message);
  //   }
  // }

  /**
   * get latest members
   */
  async latestMembers(): Promise<any> {
    const options: IPaginationOptions = {
      page: 1,
      limit: 20,
    };
    let result = this.userRepository
      .createQueryBuilder('u')
      .orderBy('u.created_at', 'DESC');

    return await paginate(result, options);
  }

  /**
   * get top members
   */
  async topMembers(): Promise<any> {
    const options: IPaginationOptions = {
      page: 1,
      limit: 12,
    };
    let result = this.userRepository
      .createQueryBuilder('u')
      .where('u.is_top_member = true');

    return await paginate(result, options);
  }

  /**
   * Get users success stories
   */
  async successStories() {
    const options: IPaginationOptions = {
      page: 1,
      limit: 12,
    };

    const rand = Math.round(Math.random());

    try {
      let result = this.userRepository
        .createQueryBuilder('u')
        .where(`u.success_story != null or u.success_story != '' `);

      rand == 0
        ? result.orderBy('u.created_at', 'ASC')
        : result.orderBy('u.created_at', 'DESC');

      return await paginate(result, options);
    } catch (err) {
      if (err) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }
}
