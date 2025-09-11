import { Input } from "@/components/Input.tsx";

export function CreateForm() {
  return (
    <form method="POST" class="flex flex-col gap-4" action="/items">
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
