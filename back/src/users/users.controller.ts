import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { Public } from 'src/decorators/Public';
import { CreateUserDto } from './dto/createUserDto';
import { CreateOrUpdateColorUserDto } from './dto/createOrUpdateColorUser';
import { UsersService } from './users.service';
import { PatchEmailDto } from './dto/patchEmailDto';
import { PatchUserPersonalInfoDto } from './dto/patchUserPersonalInfoDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAllExceptCurrent(@Req() req) {
    const currentUserId = req.user.sub;
    const users = await this.usersService.findAll([currentUserId]);

    return users;
  }

  @Get('me')
  getMe(@Req() req) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.usersService.getById(user.sub);
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  async findById(@Param('id') id: string) {
    const user = await this.usersService.getById(id);
    return user;
  }

  @Post()
  async createUser(@Body() createUser: CreateUserDto) {
    return await this.usersService.createUser(createUser);
  }

  @Put('password')
  @Public()
  async updatePassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return await this.usersService.updatePassword(token, password);
  }

  @Patch('me/color')
  async updateCurrentUserColor(
    @Body() updateUser: CreateOrUpdateColorUserDto,
    @Req() req,
  ) {
    const currentUserId = req.user.sub;
    return await this.usersService.updateUserColor(
      currentUserId,
      updateUser.profileColor,
    );
  }

  @Patch('me/identifier')
  async patchCurrentUserEmail(
    @Body() updateEmailDto: PatchEmailDto,
    @Req() req,
  ) {
    const currentUserId = req.user.sub;
    return await this.usersService.updateUserEmail(
      currentUserId,
      updateEmailDto.email,
    );
  }

  @Patch('me/personal-info')
  async patcCurrentUserPersonalInfo(
    @Body() updateUser: PatchUserPersonalInfoDto,
    @Req() req,
  ) {
    const currentUserId = req.user.sub;
    return await this.usersService.updateUserPersonalInfo(
      currentUserId,
      updateUser,
    );
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.usersService.deleteUser(id);

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      console.error(error);

      res.status(500).json('Something went wrong');
    }
  }
}
