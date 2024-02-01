export const JwtConfig = {
  secret: process.env.JWT_SECRET || "1234",
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN_IN_SECONDS!, 10) || 60 * 60,
};
