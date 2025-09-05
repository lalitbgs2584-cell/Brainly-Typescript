import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  decodedToken?: any; 
}
