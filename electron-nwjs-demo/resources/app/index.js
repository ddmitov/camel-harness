// camel-harness demo for Electron and NW.js

// Load the camel-harness package:
var camelHarness = require('./camel-harness/camel-harness.js');

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

// Determine Perl interpreter:
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
