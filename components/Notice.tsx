import { type ComponentChild } from "preact";

type Props = {
  message: ComponentChild;
  color: string;
};

export function Notice({ message, color }: Props) {
  return (
    <div class={`p-2 bg-${color}-100 text-${color}-700 rounded mb-4`}>
      <strong>Note:</strong> {message}
    </div>
  );
}
