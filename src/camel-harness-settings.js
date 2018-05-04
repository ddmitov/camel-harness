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

const filesystemObject = require("fs");

function checkScriptExistence(scriptFullPath) {
  // This function returns only after file existence check is complete.
  var scriptExists;

  try {
    filesystemObject.accessSync(scriptFullPath);
    scriptExists = true;
  } catch (exception) {
    scriptExists = false;
    // console.log(`camel-harness: ${scriptFullPath} is not found.`);
  }

  return scriptExists;
}

module.exports.checkSettings = function(script) {
  var scriptSettingsOk;

  // Initial settings check:
  if (script.interpreter && script.scriptFullPath &&
      typeof script.stdoutFunction === "function") {
    if (checkScriptExistence(script.scriptFullPath) === true) {
      scriptSettingsOk = true;
    }
  } else {
    scriptSettingsOk = false;
    // console.log("camel-harness: ");
    // console.log("No 'interpreter', 'scriptFullPath' or 'stdoutFunction'.");
  }

  // If requestMethod is set, inputData or inputDataHarvester must be set:
  if (script.requestMethod) {
    if (script.inputData || script.inputDataHarvester) {
      scriptSettingsOk = true;
    } else {
      scriptSettingsOk = false;
      // console.log(`camel-harness: Input data is not available.`);
    }
  }

  // If inputData or inputDataHarvester is set, requestMethod must be set:
  if (script.inputData || script.inputDataHarvester) {
    if (script.requestMethod) {
      scriptSettingsOk = true;
    } else {
      scriptSettingsOk = false;
      // console.log("camel-harness: Request method is not set.");
    }
  }

  return scriptSettingsOk;
};
