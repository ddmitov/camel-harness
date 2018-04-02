'use strict';

// camel-harness
// Node.js - Electron - NW.js controller for Perl scripts
// camel-harness is licensed under the terms of the MIT license.
// Copyright (c) 2016 - 2017 Dimitar D. Mitov

// THE SOFTWARE IS PROVIDED "AS IS",
// WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
// THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const FILESYSTEM_OBJECT = require('fs');

module.exports.checkSettings = function(script) {
  var scriptSettingsOk = true;

  // Interpreter is mandatory script object property.
  if (script.interpreter === undefined) {
    console.log('camel-harness: Perl interpreter is not supplied.');
    scriptSettingsOk = false;
  }

  // Script full path is mandatory script object property.
  if (script.scriptFullPath === undefined) {
    console.log('camel-harness: Script full path is not supplied.');
    scriptSettingsOk = false;
  }

  // Script STDOUT handling function is mandatory script object property.
  if (typeof script.stdoutFunction !== 'function') {
    console.log('camel-harness: STDOUT handling function is not defined.');
    scriptSettingsOk = false;
  }

  // Start script existence check:
  if (script.scriptFullPath !== undefined &&
      checkScriptExistence(script.scriptFullPath) === false) {
    scriptSettingsOk = false;
  }

  // If requestMethod is set, inputData or inputDataHarvester must also be set:
  if (script.requestMethod !== undefined &&
      script.inputData === undefined &&
      script.inputDataHarvester === undefined) {
    console.log(`camel-harness: Input data is not available.`);
    scriptSettingsOk = false;
  }

  // If inputData or inputDataHarvester is set, requestMethod must also be set:
  if ((script.inputData !== undefined ||
      script.inputDataHarvester !== undefined) &&
      script.requestMethod === undefined) {
    console.log('camel-harness: Request method is not set.');
    scriptSettingsOk = false;
  }

  return scriptSettingsOk;
};

function checkScriptExistence(scriptFullPath) {
  // This function returns only after file existence check is complete.
  var scriptExists = true;

  try {
    FILESYSTEM_OBJECT.accessSync(scriptFullPath);
  } catch (exception) {
    console.log(`camel-harness: ${scriptFullPath} is not found.`);
    scriptExists = false;
  }

  return scriptExists;
}
