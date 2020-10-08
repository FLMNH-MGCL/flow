import path from "path";
import url from "url";
import { app, ipcMain } from "electron";
import is from "electron-is";
import { menubar, Menubar } from "menubar";
import { autoUpdater } from "electron-updater";
import spawn from "child_process";
import open from "open";
import { addContextmenu } from "./menu";

autoUpdater.checkForUpdatesAndNotify();

let mb: Menubar;

let eData: { rawData: string; isError: boolean }[] = [];

app.commandLine.appendSwitch("ignore-certificate-errors");

// ELECTRON -> CLIENT INTERACTIONS
// usage for this: tray is minimized and execution finished
ipcMain.on("notify", () => {
  if (!mb.window?.isVisible()) {
    mb.tray.setImage(path.resolve(__dirname, "assets", "flmnhActive.png"));
  }
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
      eData.push({ rawData: data.toString(), isError: false });
      mb?.window?.webContents.send("execution_stdout", eData);
    });

    child.stdout.once("end", () => {
      console.log("child stdout ended");
    });

    child.stderr.on("data", (data) => {
      eData.push({ rawData: data.toString(), isError: true });
      mb?.window?.webContents.send("execution_stderr", eData);
    });

    // TODO: figure out when this would hit
    child.on("error", (data) => {
      console.log("child error hit: " + data);
    });

    child.once("close", () => {
      console.log("child process closed");
      eData = [];
      mb?.window?.webContents.send("execution_end", "Process completed");
    });
  }
});

ipcMain.on("kill_execution", (_, data: any) => {
  const { pid } = data;

  try {
    process.kill(pid);

    mb?.window?.webContents.send("kill_execution_response", {
      killed: true,
      message: `Process ${pid} terminated`,
    });

    eData = [];
  } catch (error) {
    console.log(error);

    // assume pid does not exist until more testing
    mb?.window?.webContents.send("kill_execution_response", {
      killed: false,
      message: `Could not kill process ${pid}, unable to detect pid in system`,
    });

    eData = [];
  }
});
// END OF ELECTRON -> CLIENT INTERACTIONS

app.on("ready", () => {
  app.dock.hide();
  mb = menubar({
    index: is.dev()
      ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
      : url.format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true,
        }),
    icon: path.resolve(__dirname, "assets", "flmnh.png"),
    tooltip: "flow",
    browserWindow: {
      width: 600,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
      },
    },
    showOnAllWorkspaces: false,
  });

  mb.on("after-create-window", () => {
    if (is.dev()) {
      mb.window?.webContents.openDevTools({ mode: "undocked" });
    }

    addContextmenu(mb);
  });

  mb.on("after-show", () => {
    mb.tray.setImage(path.resolve(__dirname, "assets", "flmnh.png"));
  });
});

// reroute new windows to default browser
function createOpenHandler(_: Electron.Event, contents: Electron.webContents) {
  const anyContents = contents as any;
  anyContents.on("new-window", (e: Electron.NewWindowEvent, url: string) => {
    e.preventDefault();
    open(url);
  });
}

app.on("web-contents-created", createOpenHandler);

app.on("window-all-closed", (event: Event) => {
  app.dock.hide();
  event.preventDefault();
});
