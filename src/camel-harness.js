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

const filesystem = require("fs");
const perlProcess = require("child_process").spawn;

const allArguments = require("./camel-harness-arguments.js");
const scriptEnvironment = require("./camel-harness-environment.js");
const scriptSettings = require("./camel-harness-settings.js");

// This function returns only after script path check is complete.
function checkScriptPath (scriptFullPath) {
  try {
    filesystem.accessSync(scriptFullPath);
    return true;
  } catch (exception) {
    return false;
  }
}

module.exports.startScript = function (script) {
  // Check script settings:
  if (scriptSettings.checkSettings(script) === false) {
    return;
  }

  // Check script path:
  if (checkScriptPath(script.scriptFullPath) === false) {
    return;
  }

  // Set script environment:
  let environment = scriptEnvironment.setEnvironment(script);

  // Set all interpreter arguments:
  let interpreterArguments = allArguments.setArguments(script);

  // Run the supplied script:
  script.scriptHandler =
    perlProcess(script.interpreter, interpreterArguments, {env: environment});

  // Send POST data to the script:
  if (script.requestMethod === "POST") {
    script.scriptHandler.stdin.write(`${script.inputData}\n`);
  }

  // Handle script errors:
  script.scriptHandler.on("error", function (error) {
    if (typeof script.errorFunction === "function") {
      script.errorFunction(error);
    }
  });

  // Handle STDOUT:
  script.scriptHandler.stdout.on("data", function (data) {
    script.stdoutFunction(data.toString("utf8"));
  });

  // Handle STDERR:
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
