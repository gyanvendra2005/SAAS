"use client";
import { useEffect, useState } from "react";

export default function AdminUpgradePage() {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const tenantSlug = typeof window !== "undefined" ? localStorage.getItem("tenant_slug") : null;

  useEffect(() => {
    if (!token || role !== "admin") {
      window.location.href = "/login";
      return;
    }
    fetchTenant();
  }, []);

  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      return { error: "Invalid server response" };
    }
  }

  async function fetchTenant() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await safeJson(res);
      if (!res.ok) setError(data.error || "Failed to fetch tenant");
      else setTenant(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  }

  async function upgradeTenant() {
    setError(null);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await safeJson(res);
      if (!res.ok) setError(data.error || "Upgrade failed");
      else {
        alert("Tenant upgraded to Pro!");
        fetchTenant();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (role !== "admin") return <p className="text-center mt-10 text-red-500">Access denied.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Tenant Upgrade</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {tenant && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <p><strong>Tenant:</strong> {tenant.slug}</p>
          <p><strong>Current Plan:</strong> {tenant.plan}</p>
          {tenant.plan === "free" ? (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={upgradeTenant}
            >
              Upgrade to Pro
            </button>
          ) : (
            <p className="text-green-600 font-semibold">Tenant is already on Pro plan.</p>
          )}
        </div>
      )}
    </div>
  );
}
