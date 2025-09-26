// pages/api/notes/[id].js
import { verifyToken } from "../../../../../lib/auth.js";
import Note from "../../../../../lib/models/note.js";
import { connectDB } from "../../../../../lib/mongodb.js";

// Helper to get user info
async function getUser(req) {
  await connectDB();
  const decoded = verifyToken(req);
  return decoded; // { userId, tenantId, role }
}

// GET /api/note/:id
export async function GET(req, { params }) {
  try {
    const { tenantId } = await getUser(req);
    const { id } = params;

    const note = await Note.findOne({ _id: id, tenantId });
    if (!note) return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });

    return new Response(JSON.stringify(note), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}

// PUT /api/note/:id
export async function PUT(req, { params }) {
  try {
    const { tenantId } = await getUser(req);
    const { id } = params;

    const note = await Note.findOne({ _id: id, tenantId });
    if (!note) return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });

    const { title, content } = await req.json();
    if (title) note.title = title;
    if (content) note.content = content;
    await note.save();

    return new Response(JSON.stringify(note), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}

// DELETE /api/note/:id
export async function DELETE(req, { params }) {
  try {
    const { tenantId } = await getUser(req);
    const { id } = params;

    const note = await Note.findOne({ _id: id, tenantId });
    if (!note) return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });

    await note.deleteOne();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}

