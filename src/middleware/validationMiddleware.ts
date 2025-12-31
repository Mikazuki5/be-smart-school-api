import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(output);

    if (errors.length > 0) {
      const message = errors.map((error: ValidationError) => 
        Object.values(error.constraints || {})
      ).flat();
      return res.status(400).json({ errors: message });
    }
    
    req.body = output;
    next();
  };
};