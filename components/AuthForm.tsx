import { Button } from "@/components/Button.tsx";
import { Input } from "@/components/Input.tsx";

type Props = {
  type: "Login";
};

export function AuthForm({ type }: Props) {
  return (
    <form method="POST" class="space-y-4" action={`/api/${type.toLowerCase()}`}>
      <Input
        placeholder="Email"
        name="email"
        type="email"
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
        {type}
      </Button>
    </form>
  );
}
