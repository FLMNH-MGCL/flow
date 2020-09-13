import path from "path";
import url from "url";
import { app, ipcMain } from "electron";
import is from "electron-is";
import { menubar, Menubar } from "menubar";
import { autoUpdater } from "electron-updater";
import spawn from "child_process";

autoUpdater.checkForUpdatesAndNotify();

let mb: Menubar;

app.commandLine.appendSwitch("ignore-certificate-errors");

// ELECTRON -> CLIENT INTERACTIONS
ipcMain.on("notify", () => {
  mb.tray.setImage(path.resolve(__dirname, "flmnhActive.png"));
});

// pass in path to file, file type, args for spawn, etc
ipcMain.on("execute_program", (_, data: any) => {
  console.log(data);
  const { prefix, location, args, defaultArgs } = data;

  if (data) {
    const options = args;

    let child;
    if (prefix && prefix !== "") {
      child = spawn.spawn(prefix, [defaultArgs, location, ...options]);
    } else {
      child = spawn.spawn(location, [...options]);
    }

    mb?.window?.webContents.send("child_pid", child.pid);

    child.stdout.setEncoding("utf8");

    child.stdout.on("data", (data) => {
      mb?.window?.webContents.send("execution_stdout", data.toString());
    });

    child.once("exit", () => {
      console.log("exit signal recieved");
      mb?.window?.webContents.send("execution_end", "Process completed");
    });

    // TODO: implement
    child.stderr.on("data", (data) => {
      console.log("stderr: " + data);
      // mb?.window?.webContents.send("execution_stderr", data.toString());
    });

    // TODO: figure out which of these next listeners hit when FORCED kill vs self exit
    // START OF TODO TEST BLOCK
    child.stdout.on("error", (data) => {
      console.log("stdout error hit: " + data);
    });

    // is this redundant?
    child.stderr.on("error", (data) => {
      console.log("stderr error hit?: " + data);
    });

    child.on("error", (data) => {
      console.log("child error hit: " + data);
    });
    // END OF TODO TEST BLOCK
  }
});

ipcMain.on("kill_process", (_, data: any) => {
  const { pid } = data;

  try {
    process.kill(pid);

    mb?.window?.webContents.send("kill_process_response", {
      killed: true,
      message: `Process ${pid} terminated`,
    });
  } catch (error) {
    console.log(error);

    // assume pid does not exist until more testing
    mb?.window?.webContents.send("kill_process_response", {
      killed: false,
      message: `Could not kill process ${pid}, unable to detect pid in system`,
    });
  }
});
// END OF ELECTRON -> CLIENT INTERACTIONS

app.on("ready", () => {
  mb = menubar({
    index: is.dev()
      ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
      : url.format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true,
        }),
    icon: path.resolve(__dirname, "flmnh.png"),
    tooltip: "flow",
    browserWindow: {
      //   transparent: true,
      //   resizable: false,
      //   fullscreenable: false,
      width: 500,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    },
    showOnAllWorkspaces: false,
    // preloadWindow: true,
  });

  mb.on("after-create-window", () => {
    if (is.dev()) {
      mb.window?.webContents.openDevTools({ mode: "undocked" });
    }
  });

  mb.on("after-show", () => {
    mb.tray.setImage(path.resolve(__dirname, "flmnh.png"));
  });
});

app.on("window-all-closed", (event: Event) => {
  app.dock.hide();
  event.preventDefault();
});
