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

ipcMain.on("notify", () => {
  mb.tray.setImage(path.resolve(__dirname, "flmnhActive.png"));
});

// pass in path to file, file type, args for spawn, etc
ipcMain.on("execute_program", (_, data: any) => {
  console.log(data);
  const { prefix, location, args } = data;

  // console.log(config);

  // console.log(command);

  if (data) {
    // const commandArray = command.split(" ");
    // const prefix = commandArray[0];
    // const location = commandArray[1];
    // const options = commandArray.length > 2 ? commandArray[2] : null;
    const options = args;

    let child;
    if (prefix && prefix !== "") {
      child = spawn.spawn(prefix, [location, ...options]);
    } else {
      child = spawn.spawn(location, [...options]);
    }

    child.stdout.setEncoding("utf8");

    child.stdout.on("data", (data) => {
      mb?.window?.webContents.send("execution_stdout", data.toString());
    });

    child.once("exit", () => {
      console.log("exit signal recieved");
      mb?.window?.webContents.send("execution_end", "Process completed");
    });
  }
});

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
