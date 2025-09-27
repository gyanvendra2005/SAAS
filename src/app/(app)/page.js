"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Multi-Tenant Notes App
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          A demo SaaS Notes application built with{" "}
          <span className="font-medium text-indigo-600">Next.js</span>,{" "}
          <span className="font-medium text-green-600">MongoDB</span>, and{" "}
          <span className="font-medium text-sky-600">Tailwind</span>.
        </p>
      </div>

      <Card className="w-full max-w-lg shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold text-gray-800">
            Get Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-700">
            Use one of the seeded accounts to log in and explore tenant-based
            access and note management.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-1">Acme Tenant</h3>
              <p className="text-sm text-gray-600">
                Admin: <code>admin@acme.test</code>
              </p>
              <p className="text-sm text-gray-600">
                Member: <code>user@acme.test</code>
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-1">Globex Tenant</h3>
              <p className="text-sm text-gray-600">
                Admin: <code>admin@globex.test</code>
              </p>
              <p className="text-sm text-gray-600">
                Member: <code>user@globex.test</code>
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/login" className="w-full sm:w-auto bg-black">
              <Button className="w-full px-8 py-2 text-lg">Login</Button>
            </Link>
          </div>

          <p className="text-xs text-center text-gray-500">
            All accounts use password: <code>password</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
