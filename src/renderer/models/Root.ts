import { types } from "mobx-state-tree";
import { Programs } from "./Programs";

export const RootModel = types.model({
  programs: Programs,
});
