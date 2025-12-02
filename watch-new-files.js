import chokidar from "chokidar";
import { spawn } from "child_process";
import kill from "kill-port";

// Path to the folder to watch
const watchPath = "./src";
const watchPath2 = "./src/partials";

// Keep track of existing files
const existingFiles = new Set();

const startServer = () => {
  const server = spawn("npm", ["start"], {
    stdio: "inherit",
    shell: true,
  });
  return server;
};

// Start the Webpack Dev Server
let server = startServer();

const restartServer = async () => {
  await kill(5000);
  server.kill();
  server = startServer();
};

// Watch for file changes (additions and removals)
const watcher = chokidar.watch(watchPath, { ignoreInitial: true });
const watcher2 = chokidar.watch(watchPath2, { ignoreInitial: true });

watcher.on("add", (filePath) => {
  if (!existingFiles.has(filePath)) {
    existingFiles.add(filePath);
    restartServer();
  }
});

watcher.on("unlink", (filePath) => {
  if (existingFiles.has(filePath)) {
    existingFiles.delete(filePath);
    restartServer();
  }
});

watcher2.on("change", (filePath) => {
  restartServer();
});

// Populate existing files on startup
watcher.on("ready", () => {
  const watched = watcher.getWatched();
  for (const [folder, files] of Object.entries(watched)) {
    files.forEach((file) => existingFiles.add(`${folder}/${file}`));
  }
});

process.on("SIGINT", () => {
  watcher.close();
  watcher2.close();
  server.kill();
  process.exit();
});
