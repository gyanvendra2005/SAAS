// app/api/notes/route.js
import Note from "@/../lib/models/note";
import Tenant from "@/../lib/models/tenant";
import { connectDB } from "@/../lib/mongodb";
import { verifyToken } from "@/../lib/auth";

// Helper to get user info from token
async function getUser(req) {
  await connectDB();
  const decoded = verifyToken(req);
  return decoded; // { userId, tenantId, role }
}

// GET /api/notes
export async function GET(req) {
  try {
    const { tenantId } = await getUser(req);
    const notes = await Note.find({ tenantId });
    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}

// POST /api/notes
export async function POST(req) {
  try {
    const { tenantId, userId } = await getUser(req);
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return new Response(JSON.stringify({ error: "Tenant not found" }), { status: 404 });

    if (tenant.plan === "free") {
      const count = await Note.countDocuments({ tenantId });
      if (count >= 3)
        return new Response(JSON.stringify({ error: "Note limit reached. Upgrade to Pro." }), { status: 403 });
    }

    const { title, content } = await req.json();
    const note = await Note.create({ title, content, tenantId, userId });
    return new Response(JSON.stringify(note), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}
