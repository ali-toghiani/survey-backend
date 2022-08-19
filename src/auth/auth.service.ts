import {
    Injectable,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';

  import { promisify } from 'util';
  import { randomBytes, scrypt as _scrypt } from 'crypto';

import { UsersService } from 'src/users/services/users.service';
  
  const scrypt = promisify(_scrypt);
  
  @Injectable()
  export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
        ) {}
  
    async signup(username: string, email: string, password: string) {
      // See if email is in usea
      const users = await this.usersService.find(username);
      if (users.length) {
        throw new BadRequestException('username in use');
      }
      
      const usersCheckEmail = await this.usersService.findEmail(email);
      if (users.length) {
        throw new BadRequestException('email in use');
      }

      // Hash the users password
      // Generate a salt
      const salt = randomBytes(8).toString('hex');
  
      // Hash the salt and the password together
      const hash = (await scrypt(password, salt, 32)) as Buffer;
  
      // Join the hashed result and the salt together
      const result = salt + '.' + hash.toString('hex');
  
      // Create a new user and save it
      const user = await this.usersService.create(username, email, result);
  
      // return the user
      return user;
    }
  
    async signin(email: string, password: string) {
      const [user] = await this.usersService.find(email);
      if (!user) {
        throw new NotFoundException('user not found');
      }
  
      const [salt, storedHash] = user.password.split('.');
  
      const hash = (await scrypt(password, salt, 32)) as Buffer;
  
      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('bad password');
      }

      let payload = { 
        username: user.username,
        role: user.parentId ? 'ADMIN' : 'MOD',
        hasToken: !user.parentId && user.apiToken
        };

      return {
      access_token: this.jwtService.sign(payload),
    };
    }
  }
  