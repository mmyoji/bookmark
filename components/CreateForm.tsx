import { Input } from "@/components/Input.tsx";

export function CreateForm() {
  return (
    <form method="POST" class="space-y-4" action="/api/items">
      <Input
        placeholder="URL"
        name="url"
        type="url"
        required
        class="w-full"
        pattern="https?://.*"
      />
      <input type="submit" hidden />
    </form>
  );
}
