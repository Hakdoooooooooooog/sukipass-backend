import type { Request, Response, NextFunction } from 'express';
import type { BusinessService } from './business.service.js';
import {
  CreateBusinessSchema,
  UpdateBusinessSchema,
  GetBusinessesSchema,
} from './business.schema.js';
import { Prisma, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: Role;
  };
}

function generateAccountNumber(): string {
  return 'OWN-' + Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  public createBusiness = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = CreateBusinessSchema.safeParse(req);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors.body });
        return;
      }

      const { password, ...restData } = parsed.data.body;

      const saltRounds = 10;
      const generatedHash = await bcrypt.hash(password, saltRounds);
      const ownerAccountNumber = generateAccountNumber();

      const servicePayload = {
        ...restData,
        passwordHash: generatedHash,
      } as unknown as Parameters<typeof this.businessService.createWithOwner>[0];

      // Passing mapped structure down the service pipeline
      const result = await this.businessService.createWithOwner(servicePayload, ownerAccountNumber);

      res.status(201).json(result);
    } catch (error) {
      // Catch unique constraint failures from Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          res.status(400).json({
            error: {
              message: 'Registration failed. The username or email is already taken.',
            },
          });
          return;
        }
      }
      next(error);
    }
  };

  public getBusinesses = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const businesses = await this.businessService.findAll();
      res.status(200).json(businesses);
    } catch (error) {
      next(error);
    }
  };

  getAllPublic = async (req: Request, res: Response): Promise<void> => {
    const parsed = GetBusinessesSchema.safeParse(req);
    const searchQuery = parsed.success ? parsed.data.query.search : undefined;

    const businesses = await this.businessService.getAllPublic(searchQuery);

    res.status(200).json({ success: true, data: businesses });
  };

  public getBusinessById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const business = await this.businessService.findById(id);

      if (!business) {
        res.status(404).json({ error: { message: 'Business not found.' } });
        return;
      }

      res.status(200).json(business);
    } catch (error) {
      next(error);
    }
  };

  public updateBusiness = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const currentUser = req.user;

      const parsed = UpdateBusinessSchema.safeParse(req);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors.body });
        return;
      }

      const existingBusiness = (await this.businessService.findById(id)) as {
        ownerId: string;
      } | null;
      if (!existingBusiness) {
        res.status(404).json({ error: { message: 'Business not found.' } });
        return;
      }

      const isOwner = currentUser?.id === existingBusiness.ownerId;
      const isAdmin = currentUser?.role === 'ADMIN';

      if (!isOwner && !isAdmin) {
        res.status(403).json({
          error: { message: 'Forbidden. You do not have permission to update this business.' },
        });
        return;
      }

      if (currentUser?.role === 'BUSINESS_OWNER' && parsed.data.body.category) {
        res.status(403).json({
          error: {
            message:
              'Forbidden. Business owners are not allowed to modify their business category.',
          },
        });
        return;
      }

      const updatedBusiness = await this.businessService.update(id, parsed.data.body);
      res.status(200).json(updatedBusiness);
    } catch (error) {
      next(error);
    }
  };
}
