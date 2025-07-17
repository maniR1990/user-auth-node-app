import { loginInput } from '../domain/user.schema';
import { verifyUserCredentials } from '../data-access/user.repo';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = '1d';

export async function verifyUser(input: loginInput) {
  const { email } = input;
  const user = await verifyUserCredentials(email);
  if (!user) {
    throw new Error('No registered user');
  }
  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) throw new Error('Invalid credentials');

  // jwt token generation:
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { token, user: { id: user.id, email: user.email } };
}
