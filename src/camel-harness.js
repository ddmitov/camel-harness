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
function checkSettings (script) {
  if (!script.scriptFullPath || typeof script.stdoutFunction !== "function") {
    throw Error("camel-harness: Missing 'scriptFullPath' or 'stdoutFunction'");
  }
}

// Start Perl script - the main function of 'camel-harness':
module.exports.startScript = function (script) {
  // Check mandatory script settings:
  checkSettings(script);

  // Run script:
  script.scriptHandler =
    perlProcess((script.interpreter || "perl"),
                commandLine.setArguments(script),
                {env: environment.setEnvironment(script)});

  // Send POST data to script:
  if (script.inputData && script.requestMethod !== "GET") {
    script.scriptHandler.stdin.write(`${script.inputData}\n`);
  }

  // Handle script errors:
  script.scriptHandler.on("error", function (error) {
    if (typeof script.errorFunction === "function") {
      script.errorFunction(error);
    }
  });

  // Handle script STDOUT:
  script.scriptHandler.stdout.on("data", function (data) {
    script.stdoutFunction(data.toString("utf8"));
  });

  // Handle script STDERR:
  script.scriptHandler.stderr.on("data", function (data) {
    if (typeof script.stderrFunction === "function") {
      script.stderrFunction(data.toString("utf8"));
    }
  });

  // Handle script exit:
  script.scriptHandler.on("exit", function (exitCode) {
    if (typeof script.exitFunction === "function") {
      script.exitFunction(exitCode);
    }
  });
};
