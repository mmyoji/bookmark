import { type ComponentChildren } from "preact";

import { Head } from "@/components/Head.tsx";

type Props = {
  children: ComponentChildren;
  title?: string;
};

export function Layout({ children, title }: Props) {
  return (
    <>
      <Head title={title} />
      {children}
    </>
  );
}
