// pages/api/tenants/[slug]/upgrade.js
import Tenant from "../../../../../../lib/models/tenant.js";
import { connectDB } from "../../../../../../lib/mongodb.js";
import { verifyToken } from "../../../../../../lib/auth.js";


export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId, tenantId, role } = verifyToken(req);
    const { slug } = params;

    if (role !== "admin") {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    const tenant = await Tenant.findOne({ _id: tenantId, slug });
    if (!tenant) {
      return new Response(JSON.stringify({ error: "Tenant not found" }), { status: 404 });
    }

    // Always return valid JSON
    return new Response(JSON.stringify({ slug: tenant.slug, plan: tenant.plan }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}


export async function POST(req, { params }) {
  try {
    await connectDB();

    const { userId, tenantId, role } = verifyToken(req);
    const { slug } = params;

    if (role !== "admin") {
      return new Response(JSON.stringify({ error: "Only Admin can upgrade tenant" }), { status: 403 });
    }

    const tenant = await Tenant.findOne({ _id: tenantId, slug });
    if (!tenant) {
      return new Response(JSON.stringify({ error: "Tenant not found" }), { status: 404 });
    }

    tenant.plan = "pro";
    await tenant.save();

    return new Response(JSON.stringify({ success: true, plan: tenant.plan }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}
