import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/enums/user-roles';

@Injectable()
export class TokenGeneratorService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(id: number, role: UserRole): string {
    return this.jwtService.sign({ id, role });
  }
}
