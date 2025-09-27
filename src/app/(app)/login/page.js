"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("newuser@acme.test");
  const [password, setPassword] = useState("password");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const d = await res.json();
      if (!res.ok) {
        setErr(d.error || "Login failed");
        return;
      }

      localStorage.setItem("token", d.token);
      localStorage.setItem("tenant_slug", d.tenant.slug);
      localStorage.setItem("role", d.user.role);
      localStorage.setItem("tenant_plan", d.tenant.plan);

      router.push("/notes");
    } catch (error) {
      setErr("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border border-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-white">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="text-gray-200">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label className="text-gray-200">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {err && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* <p className="text-center text-sm text-gray-400 mt-2">
              Forgot your password? <a href="#" className="text-indigo-400 hover:underline">Reset</a>

            </p> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
