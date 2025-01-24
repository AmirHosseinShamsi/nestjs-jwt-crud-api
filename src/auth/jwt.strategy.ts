import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'],
      passReqToCallback: true,
    });
  }

  //when jwt decrypted => its data sends to the validate function and this function can send
  //the data to request object in the route that has AuthGuard
  async validate() {
    return { test: 'null' };
  }
}
