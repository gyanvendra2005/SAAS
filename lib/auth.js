// lib/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/user";
import { connectDB } from "./mongodb.js";

export async function login(email, password) {
  console.log("hi");
  
  await connectDB();
  console.log(email, password);
  
  const user = await User.findOne({ email }).populate("tenantId");
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      userId: user._id,
      tenantId: user.tenantId._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user, tenant: user.tenantId };
}
export function verifyToken(req) {
  // For NextRequest (App Router)
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("No token provided");

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error("Invalid token");
  }
}

export function withAuth(handler) {
  return async (req, res) => {
    await connectDB();

    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (!authHeader) throw new Error("No token provided");

      const token = authHeader.split(" ")[1]; // Bearer <token>
      if (!token) throw new Error("No token provided");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error("User not found");

      req.user = {
        userId: user._id,
        tenantId: decoded.tenantId,
        role: user.role,
      };

      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  };
}
