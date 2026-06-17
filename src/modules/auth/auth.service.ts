import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository.js';
import type { User, Business } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export class AuthService {
  private authRepository = new AuthRepository();

  /**
   * Authenticates user credentials and issues JWT token.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    user: Omit<User, 'password'>;
  }> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.isTemporary) {
      throw new Error('Account not yet claimed. Please complete your registration first.');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    const safeUser = { ...user };
    delete (safeUser as Partial<User>).password;

    return { token, user: safeUser };
  }

  /**
   * Retrieves current authenticated user profile.
   */
  async getUserProfile(
    userId: string,
  ): Promise<Omit<User, 'password'> & { businesses: Business[] }> {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const safeUser = { ...user };
    delete (safeUser as Partial<User>).password;

    return safeUser as Omit<User, 'password'> & { businesses: Business[] };
  }

  updateUserProfile = async (userId: string, data: { username?: string; email?: string }) => {
    return await prisma.user.update({
      where: { id: userId },
      data: data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
  };

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
