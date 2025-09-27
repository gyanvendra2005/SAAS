import { connectDB } from "../../../../lib/mongodb";
import Tenant from "../../../../lib/models/tenant";
import User from "../../../../lib/models/user";
import bcrypt from "bcryptjs";

export async function POST() {
  await connectDB();

//  try{
//    // Wipe old tenants & users
 
//  }
// catch((err) => {
//   console.error("❌ Seed failed", err);
//   process.exit(1);

// });
try {
   await Tenant.deleteMany({});
  await User.deleteMany({});

  // Create tenants
  const acme = await Tenant.create({ name: "Acme Inc", slug: "acme", plan: "free" });
  const globex = await Tenant.create({ name: "Globex Corp", slug: "globex", plan: "free" });

  const passwordHash = await bcrypt.hash("password", 10);

  // Seed users
  const users = [
    { email: "admin@acme.test", role: "admin", tenantId: acme._id },
    { email: "user@acme.test", role: "member", tenantId: acme._id },
    { email: "admin@globex.test", role: "admin", tenantId: globex._id },
    { email: "user@globex.test", role: "member", tenantId: globex._id }
  ];

  for (let u of users) {
    await User.create({
      email: u.email,
      passwordHash,
      role: u.role,
      tenantId: u.tenantId
    });
  }

  console.log("✅ Seed completed! Created tenants and test users.");
  process.exit(0);
} catch (error) {
  console.error("❌ Seed failed", error);
}
}
