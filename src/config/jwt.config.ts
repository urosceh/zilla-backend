export const JwtConfig = {
  secret: process.env.JWT_SECRET || "1234",
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN_IN_MS!, 10) || 1000 * 60 * 60,
};
