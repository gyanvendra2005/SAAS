import { connectDB } from "../../../../../lib/mongodb";
import User from "../../../../../lib/models/user";
import Tenant from "../../../../../lib/models/tenant";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, existingUser.passwordHash);
    if (!validPassword) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const tenant = await Tenant.findById(existingUser.tenantId);

    const token = jwt.sign(
      { userId: existingUser._id, tenantId: tenant._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        user: { id: existingUser._id, email: existingUser.email, role: existingUser.role },
        tenant: { id: tenant._id, slug: tenant.slug, plan: tenant.plan },
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
