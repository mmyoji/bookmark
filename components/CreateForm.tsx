import { Button } from "@/components/Button.tsx";
import { Input } from "@/components/Input.tsx";

export function CreateForm() {
  return (
    <form method="POST" class="space-y-4" action="/api/items">
      <div class="grid grid-cols-3 gap-x-0.5">
        <Input
          placeholder="URL"
          name="url"
          type="url"
          required
          class="col-span-2"
          pattern="https?://.*"
        />
        <Button type="submit" class="shadow-md rounded-sm">Submit</Button>
      </div>
    </form>
  );
}
