import Tenant from "../../../../../../lib/models/tenant.js";
import { connectDB } from "../../../../../../lib/mongodb.js";
import { verifyToken } from "../../../../../../lib/auth.js";
import bcrypt from "bcryptjs";
import User from "../../../../../lib/models/user.js";

export async function POST(req, { params }) {
  await connectDB();
  const { slug } = params;

  const auth = verifyToken(req);
  if (auth.role !== "admin") {
    return new Response(
      JSON.stringify({ error: "Only admins can invite users" }),
      { status: 403 }
    );
  }

  const tenant = await Tenant.findOne({ slug });
  if (!tenant) {
    return new Response(JSON.stringify({ error: "Tenant not found" }), { status: 404 });
  }

  const { email, role } = await req.json();
  const newUser = await User.create({
    email,
    role: role || "member",
    passwordHash: "password",
    tenantId: tenant._id,
  });

  return new Response(JSON.stringify(newUser), { status: 201 });
}
