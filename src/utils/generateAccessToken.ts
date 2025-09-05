import jwt, { Secret } from "jsonwebtoken";

// Generate Access Token
export const generateToken = (
  payload: object,
  secret: Secret,
  options: object
): string => {
  return jwt.sign(payload, secret, options);
};
