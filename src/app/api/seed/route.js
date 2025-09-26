import { connectDB } from "../../../../lib/mongodb";
import Tenant from "../../../../lib/models/tenant";

export async function GET() {
  try {
    await connectDB();

    await Tenant.deleteMany({}); // clear old tenants
    await Tenant.insertMany([
      { name: "Acme Inc.", slug: "acme", plan: "free" },
      { name: "Globex Corp.", slug: "globex", plan: "free" }
    ]);

    return new Response(JSON.stringify({ message: "Tenants seeded successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
