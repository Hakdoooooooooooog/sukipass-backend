import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginSchema, PasswordUpdateSchema } from './auth.schema.js';

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body) {
        res.status(400).json({ error: 'Missing request body' });
        return;
      }

      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }

      const { email, password } = parsed.data;
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  me = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user = await this.authService.getUserProfile(req.user.id);
      res.status(200).json({ data: user });
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      });
    }
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Logged out successfully' });
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const updatedUser = await this.authService.updateUserProfile(userId, req.body);
      res.status(200).json({ data: updatedUser });
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  };

  updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = PasswordUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { oldPassword, newPassword } = parsed.data;
      await this.authService.updatePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to update password',
      });
    }
  };
}
