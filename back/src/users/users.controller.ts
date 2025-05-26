import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { Public } from 'src/decorators/Public';
import { CreateOrUpdateUserDto } from './dto/createOrUpdateUser';
import {  CreateOrUpdateColorUserDto } from './dto/createOrUpdateColorUser';
import { FindAllUsersDto } from './dto/usersList';
import { UsersService } from './users.service';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return users;
  }

  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  async findById(@Param('id') id: string): Promise<User | null> {
    const user = await this.usersService.getById(id);
    return user;
  }

  @Post()
  async createUser(@Body() createUser: CreateOrUpdateUserDto) {
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

  @Put(':id/color')
  async updateColorUser(
    @Param('id') id: string,
    @Body() updateUser: CreateOrUpdateColorUserDto,
  ) {
    return await this.usersService.updateUserColor(id, updateUser.profileColor);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUser: CreateOrUpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUser);
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
