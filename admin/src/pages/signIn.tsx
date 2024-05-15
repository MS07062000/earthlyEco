import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignIn() {
  return (
    <div className="w-full lg:grid lg:items-center lg:justify-center lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>

            <Button
              type="submit"
              className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-yellow-800 bg-[linear-gradient(110deg,#FACA15,45%,#FCE96A,55%,#FACA15)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:border-yellow-800 dark:focus:ring-offset-yellow-800"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:inline">
        <img
          src="/assets/login.avif"
          alt="Image"
          className="max-h-screen w-full object-cover"
        />
      </div>
    </div>
  );
}
