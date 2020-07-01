/* eslint-disable no-console */
const { default: installExtension, EMBER_INSPECTOR } = require('electron-devtools-installer');
const { pathToFileURL } = require('url');
const { app, protocol, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const protocolServe = require('electron-protocol-serve');

// Ember app configuration
const emberAppDir = path.resolve(__dirname, '..', 'ember-dist');
const emberAppProtocol = 'serve';
const emberAppLocation = `${emberAppProtocol}://dist`;

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Remove preload scripts
    delete webPreferences.preload
    delete webPreferences.preloadURL

    // Verify webcontents source
    if (!params.src.startsWith(emberAppLocation)) event.preventDefault();
  });

  // Disable unapproved window creation
  contents.on('new-window', async (event, navigationUrl) => {
    event.preventDefault()
    await shell.openExternal(navigationUrl)
  });

  // By default, webContents may show only the app and no other locations.
  contents.on('will-navigate', (event, url) => {
    if (!url.startsWith(emberAppLocation)) event.preventDefault();
  });
})

/* Register a `serve` protocol to surface ember app distribution folder
   Must be defined before `ready` event.
*/
protocolServe({ cwd: emberAppDir, app, protocol });
protocol.registerSchemesAsPrivileged([{
  scheme: emberAppProtocol,
  privileges: {
    secure: true,
    standard: true
  }
}]);

app.on('ready', async () => {
  if (isDev) {
    try {
      require('devtron').install();
    } catch (err) {
      console.log('Failed to install Devtron: ', err);
    }
    try {
      await installExtension(EMBER_INSPECTOR);
    } catch (err) {
      console.log('Failed to install Ember Inspector: ', err);
    }
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    preload: path.join(app.getAppPath(), 'preload.js'),
    webPreferences: {
      sandbox: true,
      webSecurity: true,
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      allowRunningInsecureContent: false
    }
  });

  mainWindow.loadURL(emberAppLocation);

  // If a loading operation goes wrong, we'll send Electron back to
  // Ember App entry point
  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadURL(emberAppLocation);
  });

  mainWindow.webContents.on('crashed', () => {
    console.log('Your Ember app (or other code) in the main window has crashed.');
    console.log('This is a serious issue that needs to be handled and/or debugged.');
  });

  mainWindow.on('unresponsive', () => {
    console.log('Your Ember app (or other code) has made the window unresponsive.');
  });

  mainWindow.on('responsive', () => {
    console.log('The main window has become responsive again.');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

// Handle an unhandled error in the main thread
//
// Note that 'uncaughtException' is a crude mechanism for exception handling intended to
// be used only as a last resort. The event should not be used as an equivalent to
// "On Error Resume Next". Unhandled exceptions inherently mean that an application is in
// an undefined state. Attempting to resume application code without properly recovering
// from the exception can cause additional unforeseen and unpredictable issues.
//
// Attempting to resume normally after an uncaught exception can be similar to pulling out
// of the power cord when upgrading a computer -- nine out of ten times nothing happens -
// but the 10th time, the system becomes corrupted.
//
// The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated
// resources (e.g. file descriptors, handles, etc) before shutting down the process. It is
// not safe to resume normal operation after 'uncaughtException'.
process.on('uncaughtException', (err) => {
  console.log('An exception in the main thread was not handled.');
  console.log('This is a serious issue that needs to be handled and/or debugged.');
  console.log(`Exception: ${err}`);
});
