import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string; error?: string };
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-navy-900">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in to manage your business finances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {searchParams.registered && (
            <div className="rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
              Account created successfully. Please sign in.
            </div>
          )}
          {searchParams.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {searchParams.error === "CredentialsSignin"
                ? "Invalid email or password"
                : "Unable to sign in"}
            </div>
          )}
          <LoginForm />
          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-teal-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
