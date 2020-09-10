// export const languages = [
//   { text: "Python", value: ".py" },
//   { text: "RustBinary", value: "" },
//   { text: "Cargo", value: "N/A" },
// ];

type LanguageDetails = {
  extension: string;
  prefix?: string;
  suffix?: string;
  tip?: string;
};

export const languages: Record<string, LanguageDetails> = {
  Python: { extension: ".py", prefix: "python3 -u" },
  RustBinary: {
    extension: "",
    tip:
      "Rust binary files do not have extensions, and do not have any prefix to run them - it's rather simpliar to running a bash script",
  },
  // Cargo: {
  //   extension: ".toml",
  //   suffix: " -- ",
  //   tip:
  //     "Running a cargo project from another directory requires you to declare the path to the project's .toml file",
  // },
};

// export const tooltips: Record<string, string> = {
//   RustBinary:
//     "Rust binary files do not have extensions, and do not have any prefix to run them",
//   Cargo:
//     "Adding a Cargo project requires a reference to the root folder of the project, as opposed to any file. Therefore, there are no accepted extensions.",
// };
