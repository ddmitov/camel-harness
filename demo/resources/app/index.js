'use strict';

// camel-harness demo for Electron and NW.js

// Load the camel-harness package:
var camelHarness = require('./camel-harness/camel-harness.js');

// NW.js compatible code:
var nwCloseWindow = false;

// Determine the operating system and initialize 'path' object:
var os = require('os');
var platform = os.platform();

var path;
if (platform !== "win32") {
  path = require('path').posix;
} else {
  path = require('path').win32;
}

// Get the full path of the directory where Electron or NW.js binary is located:
var binaryPath = process.execPath;
var binaryDirectory = path.dirname(binaryPath);

// Get the full path of the application root directory:
var applicationDirectory = path.join(binaryDirectory, "resources", "app");

// Perl interpreter:
var perlInterpreter = "perl";
if (platform === "win32") {
  // Check for a portable Perl interpreter:
  var portablePerl =
      path.join(binaryDirectory, "perl", "bin", "perl.exe");
  var filesystem = require('fs');
  if (filesystem.existsSync(portablePerl)) {
    perlInterpreter = portablePerl;
  }
}

// version.pl:
var versionScriptFullPath =
    path.join(applicationDirectory, "perl", "version.pl");

var versionScript = new Object();
versionScript.interpreter = "perl";
versionScript.scriptFullPath = versionScriptFullPath;
versionScript.interpreterSwitches = "-M-ops=fork";

versionScript.stdoutFunction = function(stdout) {
  document.getElementById("version-script").innerHTML = stdout;
};

// counter.pl full path:
var counterScriptFullPath =
    path.join(applicationDirectory, "perl", "counter.pl");

// counter.pl - first instance:
var counterScriptOne = new Object();
counterScriptOne.interpreter = "perl";
counterScriptOne.scriptFullPath = counterScriptFullPath;
counterScriptOne.interpreterSwitches = "-M-ops=fork";

counterScriptOne.stdoutFunction = function(stdout) {
  document.getElementById("long-running-script-one").innerHTML = stdout;
};

// counter.pl - second instance:
var counterScriptTwo = new Object();
counterScriptTwo.interpreter = "perl";
counterScriptTwo.scriptFullPath = counterScriptFullPath;
counterScriptTwo.interpreterSwitches = "-M-ops=fork";

counterScriptTwo.stdoutFunction = function(stdout) {
  document.getElementById("long-running-script-two").innerHTML = stdout;
};

// interactive script:
const interactiveScriptInstance = require('./camel-harness/camel-harness.js');
var interactiveScript = new Object();

function startInteractiveScript() {
  var interactiveScriptFullPath =
      path.join(applicationDirectory, "perl", "interactive.pl");

  interactiveScript.interpreter = "perl";
  interactiveScript.scriptFullPath = interactiveScriptFullPath;

  interactiveScript.stdoutFunction = function(stdout) {
    if (stdout.match(/_closed_/)) {
      // Electron compatible code:
      if (navigator.userAgent.match(/Electron/)) {
        const {ipcRenderer} = require('electron');
        ipcRenderer.send('asynchronous-message', 'close');
      }
      // NW.js compatible code:
      if (typeof(nw) !== 'undefined') {
        nwCloseWindow = true;
        var nwWindow = nw.Window.get();
        nwWindow.close();
      }
    } else {
      document.getElementById("interactive-script-output").innerHTML = stdout;
    }
  };

  interactiveScriptInstance.startScript(interactiveScript);
}

function sendDataToInteractiveScript() {
  var data = document.getElementById("interactive-script-input").value;
  interactiveScript.scriptHandler.stdin.write(data + "\n");
}

function closeInteractiveScript() {
  interactiveScript.scriptHandler.stdin.write("_close_\n");
}

// Electron compatible code:
if (navigator.userAgent.match(/Electron/)) {
  // Wait for close event message from the main process and react accordingly:
  require('electron').ipcRenderer.on('closeInteractiveScript', function() {
    closeInteractiveScript();
  });
}

// NW.js compatible code:
if (typeof(nw) !== 'undefined') {
  var nwWindow = nw.Window.get();

  nwWindow.on('close', function() {
    if (nwCloseWindow === false) {
      nwWindow.close(false);
      closeInteractiveScript();
    } else {
      nwWindow.close(true);
    }
  });
}
