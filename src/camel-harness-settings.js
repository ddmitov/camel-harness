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

// This function returns only after script existence check is complete.
function checkScriptExistence(scriptFullPath) {
  try {
    filesystemObject.accessSync(scriptFullPath);
    return true;
  } catch (exception) {
    // console.log(`camel-harness: ${scriptFullPath} is not found.`);
    return false;
  }
}

module.exports.checkSettings = function(script) {
  let scriptSettingsOk = false;

  // Check mandatory settings and script full path:
  if (script.interpreter &&
      script.scriptFullPath &&
      checkScriptExistence(script.scriptFullPath) === true &&
      typeof script.stdoutFunction === "function") {
    scriptSettingsOk = true;
  }

  // If requestMethod is set, inputData or inputDataHarvester must be set:
  if (script.requestMethod) {
    if (!script.inputData || !script.inputDataHarvester) {
      return false;
    }
  }

  // If inputData or inputDataHarvester is set, requestMethod must be set:
  if (script.inputData || script.inputDataHarvester) {
    if (!script.requestMethod) {
      return false;
    }
  }

  return scriptSettingsOk;
};
