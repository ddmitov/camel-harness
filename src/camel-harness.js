"use strict";

// camel-harness
// Node.js - Electron - NW.js controller for Perl scripts
// camel-harness is licensed under the terms of the MIT license.
// Copyright (c) 2016 - 2018 Dimitar D. Mitov

// THE SOFTWARE IS PROVIDED "AS IS",
// WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
// THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const perlProcess = require("child_process").spawn;

const commandLine = require("./camel-harness-command-line.js");
const options = require("./camel-harness-options.js");

// Check mandatory script settings - 'scripr' and 'stdoutFunction':
function checkSettings (settings) {
  if (!settings.script) {
    throw Error("camel-harness: No 'script' is defined!");
  }
}

// Write data on script STDIN:
// If any data is available when the script is started and
// 'GET' request method is not set,
// data is written on script STDIN.
function stdinWrite (settings) {
  if (settings.inputData && settings.requestMethod !== "GET") {
    settings.scriptHandler.stdin.write(`${settings.inputData}\n`);
  }
}

// Handle script STDOUT:
// If 'options.stdio = "ignore"' is set,
// there is no script STDOUT.
function handleStdout(settings) {
  if (settings.scriptHandler.stdout !== null) {
    settings.scriptHandler.stdout.on("data", function (stdout) {
      if (typeof settings.stdoutFunction === "function") {
        settings.stdoutFunction(stdout.toString("utf8"));
      }
    });
  }
}

// Handle script STDERR:
// If 'options.stdio = "ignore"' is set,
// there is no script STDERR.
function handleStderr(settings) {
  if (settings.scriptHandler.stderr !== null) {
    settings.scriptHandler.stderr.on("data", function (stderr) {
      if (typeof settings.stderrFunction === "function") {
        settings.stderrFunction(stderr.toString("utf8"));
      }
    });
  }
}

// Handle script errors:
function handleErrors(settings) {
  settings.scriptHandler.on("error", function (error) {
    if (typeof settings.errorFunction === "function") {
      settings.errorFunction(error);
    }
  });
}

// Handle script exit:
function handleExit(settings) {
  settings.scriptHandler.on("exit", function (exitCode) {
    if (typeof settings.exitFunction === "function") {
      settings.exitFunction(exitCode);
    }
  });
}

// Start Perl script - the main function of 'camel-harness':
// All Perl scripts are executed asynchronously.
module.exports.startScript = function (settings) {
  // Check mandatory script settings:
  checkSettings(settings);

  // Run script:
  // If no interpreter is set,
  // 'perl' interpreter on PATH is used.
  settings.scriptHandler =
    perlProcess((settings.interpreter || "perl"),
                commandLine.setArguments(settings),
                options.setOptions(settings));

  // Write data on script STDIN, if any:
  stdinWrite(settings);

  // Handle script STDOUT:
  handleStdout(settings);

  // Handle script STDERR:
  handleStderr(settings);

  // Handle script errors:
  handleErrors(settings);

  // Handle script exit:
  handleExit(settings);
};
