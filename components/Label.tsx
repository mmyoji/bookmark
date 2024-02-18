import { type JSX } from "preact";

export function Label(props: JSX.HTMLAttributes<HTMLLabelElement>) {
  return <label {...props} class={`block text-lg ${props.class ?? ""}`} />;
}
