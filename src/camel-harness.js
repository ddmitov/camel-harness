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
const environment = require("./camel-harness-environment.js");

// Check mandatory script settings:
function checkSettings (settings) {
  if (!settings.scriptFullPath || typeof settings.stdoutFunction !== "function") {
    throw Error("camel-harness: Missing 'scriptFullPath' or 'stdoutFunction'");
  }
}

// Start Perl script - the main function of 'camel-harness':
module.exports.startScript = function (settings) {
  // Check mandatory script settings:
  checkSettings(settings);

  // Run script:
  settings.scriptHandler =
    perlProcess((settings.interpreter || "perl"),
                commandLine.setArguments(settings),
                {env: environment.setEnvironment(settings)});

  // Send POST data to script:
  if (settings.inputData && settings.requestMethod !== "GET") {
    settings.scriptHandler.stdin.write(`${settings.inputData}\n`);
  }

  // Handle script errors:
  settings.scriptHandler.on("error", function (error) {
    if (typeof settings.errorFunction === "function") {
      settings.errorFunction(error);
    }
  });

  // Handle script STDOUT:
  settings.scriptHandler.stdout.on("data", function (data) {
    settings.stdoutFunction(data.toString("utf8"));
  });

  // Handle script STDERR:
  settings.scriptHandler.stderr.on("data", function (data) {
    if (typeof settings.stderrFunction === "function") {
      settings.stderrFunction(data.toString("utf8"));
    }
  });

  // Handle script exit:
  settings.scriptHandler.on("exit", function (exitCode) {
    if (typeof settings.exitFunction === "function") {
      settings.exitFunction(exitCode);
    }
  });
};
