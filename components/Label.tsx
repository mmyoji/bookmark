import { type JSX } from "preact";

export function Label(props: JSX.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} class={`block text-lg ${props.class ?? ""}`} />;
}
