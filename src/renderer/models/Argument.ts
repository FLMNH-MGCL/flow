import { types, getParent } from "mobx-state-tree";
import { Program } from "./Programs";

export enum ArgumentType {
  EMPTY = "EMPTY",
  FLAG = "FLAG",
  FILE = "FILE",
  DIR = "DIR",
  VAR = "VAR",
  ARRAY = "ARRAY",
  JSON = "JSON",
}

// File, Dir and Var configs are essentially identical for now.
// it does not really make sense to separate them in their current
// state, but they are separate so that if they need to change independently
// the models are already there and separate

export const FileArgumentConfig = types
  .model({
    type: types.optional(types.literal(ArgumentType.FLAG), ArgumentType.FLAG),
    flag: types.optional(types.string, ""),
    value: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
  })
  .actions((self) => ({
    changeFlag(value: string) {
      self.flag = value;
    },
    changeValue(value: string) {
      self.value = value;
    },
    changeDescription(value: string) {
      self.description = value;
    },
  }));

export const DirArgumentConfig = types
  .model({
    type: types.optional(types.literal(ArgumentType.DIR), ArgumentType.DIR),
    flag: types.optional(types.string, ""),
    value: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
  })
  .actions((self) => ({
    changeFlag(value: string) {
      self.flag = value;
    },
    changeValue(value: string) {
      self.value = value;
    },
    changeDescription(value: string) {
      self.description = value;
    },
  }));

export const VarArgumentConfig = types
  .model({
    type: types.optional(types.literal(ArgumentType.DIR), ArgumentType.DIR),
    flag: types.optional(types.string, ""),
    value: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
  })
  .actions((self) => ({
    changeFlag(value: string) {
      self.flag = value;
    },
    changeValue(value: string) {
      self.value = value;
    },
    changeDescription(value: string) {
      self.description = value;
    },
  }));

export const FlagArgumentConfig = types
  .model({
    type: types.optional(types.literal(ArgumentType.FLAG), ArgumentType.FLAG),
    flag: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
  })
  .actions((self) => ({
    changeFlag(value: string) {
      self.flag = value;
    },
    changeDescription(value: string) {
      self.description = value;
    },
  }));

export const ArrayArgumentConfig = types
  .model({
    type: types.optional(types.literal(ArgumentType.ARRAY), ArgumentType.ARRAY),
    flag: types.optional(types.string, ""),
    value: types.optional(types.string, JSON.stringify({ values: [] })),
    description: types.optional(types.string, ""),
  })
  .actions((self) => ({
    changeFlag(value: string) {
      self.flag = value;
    },
    changeValue(value: string) {
      self.value = value;
    },
    changeDescription(value: string) {
      self.description = value;
    },
  }));

export const JsonArgumentConfig = types
  .model({
    type: types.optional(types.literal(ArgumentType.JSON), ArgumentType.JSON),
    flag: types.optional(types.string, ""),
    value: types.optional(types.string, "{}"),
    description: types.optional(types.string, ""),
  })
  .actions((self) => ({
    changeFlag(value: string) {
      self.flag = value;
    },
    changeValue(value: string) {
      self.value = value;
    },
    changeDescription(value: string) {
      self.description = value;
    },
  }));

const ConfigTypes = {
  [ArgumentType.FILE]: FileArgumentConfig,
  [ArgumentType.DIR]: DirArgumentConfig,
  [ArgumentType.VAR]: VarArgumentConfig,
  [ArgumentType.FLAG]: FlagArgumentConfig,
  [ArgumentType.ARRAY]: ArrayArgumentConfig,
  [ArgumentType.JSON]: JsonArgumentConfig,
};

export const Argument = types
  .model({
    type: types.enumeration(Object.keys(ArgumentType)),
    name: types.optional(types.string, ""),
    config: types.optional(
      types.maybeNull(types.union(...Object.values(ConfigTypes))),
      null
    ),
  })
  .actions((self) => ({
    delete() {
      const program = getParent<typeof Program>(getParent(self));
      program.deleteArgument(self);
    },
    changeType(newType: ArgumentType) {
      self.type = newType;

      if (newType in ConfigTypes) {
        // @ts-ignore
        self.config = ConfigTypes[newType].create({});
      } else {
        self.config = null;
      }
    },
    changeName(value: string) {
      self.name = value;
    },
  }));
