"use strict";

// camel-harness npm test

// Load the camel-harness package:
const camelHarness = require("../src/camel-harness.js");

// Determine the operating system and initialize a suitable "path" object:
let os = require("os");
let platform = os.platform();

let path;
if (platform !== "win32") {
  path = require("path").posix;
} else {
  path = require("path").win32;
}

// Compose the full path of the Perl test script:
let perlTestScriptFullPath = path.join(__dirname, "camel-harness-test.pl");

// Initialize the Perl test script object:
let perlTestScript = {};

perlTestScript.interpreter = "perl";

// perlTestScript.requestMethod = "GET";
// perlTestScript.inputData = "test";

let interpreterSwitches = [];
interpreterSwitches.push("-W");
perlTestScript.interpreterSwitches = interpreterSwitches;

perlTestScript.scriptFullPath = perlTestScriptFullPath;

perlTestScript.stdoutFunction = function(stdout) {
  console.log(`camel-harness STDOUT test: ${stdout}`);
};

perlTestScript.stderrFunction = function(stderr) {
  console.log(`camel-harness STDERR test: ${stderr}`);
};

perlTestScript.errorFunction = function(error) {
  // console.log(`camel-harness error stack: ${error.stack}`);
  // console.log(`camel-harness error code: ${error.code}`);
  // console.log(`camel-harness received signal: ${error.signal}`);

  if (error && error.code === "ENOENT") {
    console.log("Perl interpreter was not found.");
  }
};

perlTestScript.exitFunction = function(exitCode) {
  console.log(`camel-harness test script exit code is ${exitCode}`);
};

// Start the Perl test script:
camelHarness.startScript(perlTestScript);
