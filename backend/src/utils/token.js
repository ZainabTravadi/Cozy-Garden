import jwt from "jsonwebtoken";

export function createToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required.");
  }
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}
