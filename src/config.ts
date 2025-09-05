import dotenv from "dotenv"
dotenv.config()
export const config = {
  mongoUri: process.env.MONGO_URI as string,
  port: parseInt(process.env.PORT || "7000", 10),
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiry: process.env.JWT_EXPIRY || "24h"
};
