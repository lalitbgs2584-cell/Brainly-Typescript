import jwt, { Secret, SignOptions } from "jsonwebtoken";

// Generate Access Token
export const generateAccessToken = (
  payload: object,
  secret: Secret,
  options: SignOptions = { expiresIn: "15m" }
): string => {
  return jwt.sign(payload, secret, options);
};

// Generate Refresh Token
export const generateRefreshToken = (
  payload: object,
  secret: Secret,
  options: SignOptions = { expiresIn: "7d" }
): string => {
  return jwt.sign(payload, secret, options);
};
