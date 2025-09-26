import tenant from "../../../../../lib/models/tenant";
import user from "../../../../../lib/models/user";
import { connectDB } from "../../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Correct way to parse body in Next.js
    const { email, password, tenantSlug } = await req.json();

    if (!email || !password || !tenantSlug) {
      return new Response(JSON.stringify({ error: "Email, password, and tenant are required" }), {
        status: 400,
      });
    }
    

    const Tenant = await tenant.findOne({ slug: tenantSlug });
    if (!Tenant) {
      return new Response(JSON.stringify({ error: "Tenant not found" }), { status: 404 });
    }

    // Check if user already exists
    const existing = await user.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await user.create({
      email,
      passwordHash,
      role: "member",
      tenantId: Tenant._id,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, tenantId: Tenant._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(
      JSON.stringify({
        message: "Signup successful",
        token,
        user: { id: newUser._id, email: newUser.email, role: newUser.role },
        tenant: { id: Tenant._id, slug: Tenant.slug, plan: Tenant.plan },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
