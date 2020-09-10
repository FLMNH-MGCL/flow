import { types, destroy, detach } from "mobx-state-tree";
import { Argument, ArgumentType } from "./Argument";

const defaultRunCommands: Record<string, string> = {
  Python: "python3 -u ",
  Cargo: "cargo run --release --manifest-path ",
  RustBinary: "",
};

export const RunConfig = types
  .model({
    commandPrefix: types.optional(types.string, ""),
    command: types.optional(types.string, ""),
    arguments: types.optional(types.array(types.string), []),
  })
  .actions((self) => ({
    changeCommand(value: string) {
      self.command = value;
    },
    changeCommandPrefix(value: string) {
      self.commandPrefix = value;
    },
    addArgument(argument: string) {
      self.arguments.push(argument);
    },
    removeArgument(argument: string) {
      self.arguments.remove(argument);
    },
  }));

export const Program = types
  .model({
    id: types.optional(types.string, () => String(Date.now())),
    name: types.string,
    language: types.maybeNull(types.string),
    fileLocation: types.maybeNull(types.string),
    arguments: types.optional(types.array(Argument), []),
    runConfig: types.optional(types.maybeNull(RunConfig), null),
  })
  .actions((self) => ({
    changeName(value: string) {
      self.name = value;
    },
    changeLanguage(value: string) {
      self.language = value;
    },
    changeLocation(value: string) {
      self.fileLocation = value;
    },
    createArgument() {
      self.arguments.push(
        Argument.create({ name: "New Arg", type: ArgumentType.EMPTY })
      );
    },
    generateRunConfig() {
      if (self.language && defaultRunCommands[self.language] !== undefined) {
        const defaultCommand = defaultRunCommands[self.language];
        self.runConfig = RunConfig.create({
          commandPrefix: defaultCommand,
        });
      } else {
        self.runConfig = null;
      }
    },
    deleteArgument(argument: any) {
      destroy(argument);
    },
  }));

export const Programs = types
  .model({
    items: types.optional(types.array(Program), []),
  })
  .actions((self) => ({
    createProgram() {
      self.items.push(
        Program.create({
          name: "New Program",
        })
      );
    },
    deleteProgram(program: any) {
      destroy(program);
    },
    reorderPrograms(sourceIndex: number, destIndex: number) {
      const program = self.items[sourceIndex];
      detach(program);
      self.items.splice(destIndex, 0, program);
    },
  }));
