"use strict";

// camel-harness npm tests

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

// Perl script settings objects:
let basicTest = {};
let oneLiner = {};

// Basic test:
basicTest.interpreterSwitches = [];
basicTest.interpreterSwitches.push("-W");

basicTest.script = path.join(__dirname, "camel-harness-test.pl");

basicTest.stdoutFunction = function (stdout) {
  console.log(`camel-harness basic test STDOUT: ${stdout}`);
};

basicTest.stderrFunction = function (stderr) {
  console.log(`camel-harness basic test STDERR: ${stderr}`);
};

basicTest.errorFunction = function (error) {
  if (error.code === "ENOENT") {
    console.log("Perl interpreter was not found.");
  }
};

basicTest.exitFunction = function (exitCode) {
  if (exitCode === 2) {
    console.log("Perl script was not found.");
  }

  console.log(`camel-harness basic test exit code is ${exitCode}`);
  console.log(" ");

  camelHarness.startScript(oneLiner);
};

camelHarness.startScript(basicTest);

// One-liner test:
oneLiner.interpreterSwitches = [];
oneLiner.interpreterSwitches.push("-e");

oneLiner.script = "use English; print \"Perl $PERL_VERSION\";"

oneLiner.stdoutFunction = function (stdout) {
  console.log(`camel-harness one-liner test STDOUT: ${stdout}`);
};

oneLiner.exitFunction = function (exitCode) {
  console.log(`camel-harness one-liner test exit code is ${exitCode}`);
  console.log(" ");
};
