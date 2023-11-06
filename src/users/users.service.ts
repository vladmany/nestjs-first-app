import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async register(data: CreateUserDto) {
    data.password = await bcrypt.hash(data.password, 10);
    return this.repository.save(data);
  }

  findOne(email: string) {
    return this.repository.findOneBy({ email });
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }
}
