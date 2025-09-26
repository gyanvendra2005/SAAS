"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Multi-Tenant Notes App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-700">
            Welcome! This app demonstrates a multi-tenant SaaS Notes application using MongoDB, Next.js, and Tailwind.
          </p>
          <p className="text-center text-gray-600 text-sm">
            Use the seeded test accounts below to log in (password: <code>password</code>).
          </p>

          <div className="flex flex-col space-y-2">
            <Link href="/login">
              <Button className="w-full">Login</Button>
            </Link>
            <p className="text-center text-gray-500 text-xs">
              Admin: <code>admin@acme.test</code>, Member: <code>user@acme.test</code><br />
              Admin: <code>admin@globex.test</code>, Member: <code>user@globex.test</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
