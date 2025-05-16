import { createDefine } from "fresh";

export interface State {
  currentUser?: {
    username: string;
  };
  title?: string;
}

export const define = createDefine<State>();
