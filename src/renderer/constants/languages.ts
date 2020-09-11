type LanguageDetails = {
  extension: string;
  prefix?: string;
  defaultArgs?: string[];
  suffix?: string;
  tip?: string;
};

export const languages: Record<string, LanguageDetails> = {
  Python: { extension: ".py", prefix: "python3", defaultArgs: ["-u"] },
  RustBinary: {
    extension: "",
    tip:
      "Rust binary files do not have extensions, and do not have any prefix to run them - it's rather simpliar to running a bash script",
  },
};
