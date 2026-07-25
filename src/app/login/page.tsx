import { Suspense } from "react";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg p-4">
      <Skeleton className="h-[420px] w-full max-w-md rounded-2xl" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
