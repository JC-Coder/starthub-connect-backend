import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UserEntity } from '../entities/users.entity';
import { UserService } from '../services/user.service';
import * as path from 'path';
import { Helpers } from 'src/helpers';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

@Controller('user')
@SerializeOptions({ strategy: 'exposeAll' })
export class UserController {
  constructor(private userService: UserService) {}

  // profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: UserEntity) {
    return await this.userService.findByIdQuery(user.id);
  }

  // find user by skill / name
  @Get('/filter')
  async findByUniqueId(
    @Query('search_string') searchString: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    if (searchString) {
      return await this.userService.findByUniqueIdOrName(searchString, {
        page,
        limit,
      });
    } else {
      return await this.userService.findAllPaginated({ page, limit });
    }
  }

  /**
   * update profile
   * @param user - current logged in user
   * @param updateProfilePayload
   * @returns - object
   */
  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() updateProfilePayload: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(user, updateProfilePayload);
  }

  /**
   * add / update user profile image
   * @param user
   * @param file
   * @returns
   */
  @Post('profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          let filename = Helpers.generateRandomString(20);
          let fileExt = path.parse(file.originalname).ext;

          cb(null, `${filename}${fileExt}`);
        },
      }),
    }),
  )
  async addOrUpdateProfileImage(
    @CurrentUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.addOrUpdateProfileImage(user, file);
  }

  /**
   * add / update user cover image
   * @param user
   * @param file
   * @returns
   */
  @Post('cover-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          let filename = Helpers.generateRandomString(20);
          let fileExt = path.parse(file.originalname).ext;

          cb(null, `${filename}${fileExt}`);
        },
      }),
    }),
  )
  async addOrUpdateCoverImage(
    @CurrentUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.addOrUpdateCoverImage(user, file);
  }

  /**
   * Change logged in user password
   */
  // @Patch('update-password')
  // @UseGuards(JwtAuthGuard)
  // async updatePassword(
  //   @Body() updatePasswordPayload: UpdatePasswordDto,
  //   @CurrentUser() user: UserEntity,
  // ): Promise<any> {
  //   return await this.userService.updatePassword(updatePasswordPayload, user);
  // }

  /**
   * get latest members
   */
  @Get('latest-members')
  async latestMembers(): Promise<any> {
    return await this.userService.latestMembers();
  }

  /**
   * get top members
   * @returns
   */
  @Get('top-members')
  async topMembers() {
    return await this.userService.topMembers();
  }

  /**
   * Get users success stories
   */
  @Get('success-stories')
  async successStories() {
    return await this.userService.successStories();
  }
}
