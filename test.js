const spawn = require("child_process");

const path = "/Users/aaronleopold/Documents/museum/test_script.py";

let child = spawn.spawn("python3", [path, "--help"]);

child.stdout.setEncoding("utf8");

child.stdout.on("data", (data) => {
  console.log(data);
});
