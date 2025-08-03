import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/enums/user-roles';

export function generateToken(id: number, role: UserRole) {
  const jwt = new JwtService();
  const token = jwt.sign({ id, role });
  return token;
}
