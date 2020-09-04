import { types, getParent } from "mobx-state-tree";
import { Programs, Program } from "./Programs";

export enum ArgumentType {
  EMPTY = "EMPTY",
  FILE_IN = "FILE_IN",
  FILE_OUT = "FILE_OUT",
  JSON = "JSON",
  FLAG = "FLAG",
}

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
    setDescription(value: string) {
      self.description = value;
    },
  }));

const ConfigTypes = {
  [ArgumentType.FLAG]: FlagArgumentConfig,
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

// export const Programs = types
//   .model({
//     items: types.optional(types.array(Program), []),
//   })
//   .actions((self) => ({
//     createProgram() {
//       self.items.push(
//         Program.create({
//           name: "New Program",
//         })
//       );
//     },
//     deleteProgram(program: any) {
//       destroy(program);
//     },
//     reorderPrograms(sourceIndex: number, destIndex: number) {
//       const program = self.items[sourceIndex];
//       detach(program);
//       self.items.splice(destIndex, 0, program);
//     },
//   }));
