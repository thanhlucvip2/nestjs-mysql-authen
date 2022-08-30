import { UserEntity } from './user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async showAll() {
    const user = await this.userRepository.find();
    return user.map((user) => user.toResponseObject(true));
  }

  async login(data: UserDto) {
    const { username, password } = data;
    // check xem user có tồn tại trong database chưa
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject(true);
  }
  async register(data: UserDto) {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    // check user đã tồn tại chưa
    if (user) {
      throw new HttpException(
        'User đã tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject(false);
  }
}
