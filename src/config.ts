import dotenv from "dotenv";
dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI as string,
  port: parseInt(process.env.PORT || "7000", 10),

  // Legacy single JWT (if you still use it somewhere)
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiry: process.env.JWT_EXPIRY || "24h",

  // Access Token (short-lived)
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",

  // Refresh Token (long-lived)
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};
