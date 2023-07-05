import { Button } from "@/components/Button.tsx";
import { Input } from "@/components/Input.tsx";

export function AuthForm() {
  return (
    <form method="POST" class="space-y-4" action="/login">
      <Input
        placeholder="Username"
        name="username"
        type="text"
        required
        class="w-full max-w-screen-sm"
      />
      <Input
        placeholder="Password"
        name="password"
        type="password"
        required
        class="w-full"
      />
      <Button type="submit" class="w-full shadow-md">
        Login
      </Button>
    </form>
  );
}
