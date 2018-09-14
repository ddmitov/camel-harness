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

// Settings objects of all Perl test scripts:
let basicTest = {};
let oneLinerTest = {};
let inputTest = {};
let envTest = {};
let cliArgumentTest = {};

// Basic test:
basicTest.interpreterSwitches = [];
basicTest.interpreterSwitches.push("-W");

basicTest.script = path.join(__dirname, "basic-test.pl");

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

  camelHarness.startScript(oneLinerTest);
};

camelHarness.startScript(basicTest);

// One-liner test:
oneLinerTest.interpreterSwitches = [];
oneLinerTest.interpreterSwitches.push("-e");

oneLinerTest.script = "use English; print \"Perl $PERL_VERSION\";"

oneLinerTest.stdoutFunction = function (stdout) {
  console.log(`camel-harness one-liner test STDOUT: ${stdout}`);
};

oneLinerTest.exitFunction = function (exitCode) {
  console.log(`camel-harness one-liner test exit code is ${exitCode}`);
  console.log(" ");
  camelHarness.startScript(inputTest);
};

// Input test:
inputTest.script = path.join(__dirname, "input-test.pl");

inputTest.inputData = "test";

inputTest.stdoutFunction = function (stdout) {
  if (stdout === "test\n") {
    console.log("camel-harness input test is OK");
  }
};

inputTest.exitFunction = function (exitCode) {
  console.log(`camel-harness input test exit code is ${exitCode}`);
  console.log(" ");
  camelHarness.startScript(envTest);
};

// Environment test:
envTest.script = path.join(__dirname, "env-test.pl");

envTest.options = {};
envTest.options.env = {};
envTest.options.env.TEST = "test";

envTest.stdoutFunction = function (stdout) {
  if (stdout === "test") {
    console.log("camel-harness environment test is OK");
  }
};

envTest.exitFunction = function (exitCode) {
  console.log(`camel-harness environment test exit code is ${exitCode}`);
  console.log(" ");
  camelHarness.startScript(cliArgumentTest);
};

// Command line script argument test:
cliArgumentTest.script = path.join(__dirname, "cli-argument-test.pl");

cliArgumentTest.scriptArguments = [];
cliArgumentTest.scriptArguments.push("test");

cliArgumentTest.stdoutFunction = function (stdout) {
  if (stdout === "test") {
    console.log("camel-harness command line argument test is OK");
  }
};

cliArgumentTest.exitFunction = function (exitCode) {
  console.log(`camel-harness command line argument test exit code is ${exitCode}`);
  console.log(" ");
};
