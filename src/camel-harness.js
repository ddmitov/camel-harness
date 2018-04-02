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

const PERL_PROCESS = require('child_process').spawn;

const ALL_ARGUMENTS = require('./camel-harness-arguments.js');
const SCRIPT_ENVIRONMENT = require('./camel-harness-environment.js');
const SCRIPT_SETTINGS = require('./camel-harness-settings.js');

module.exports.startScript = function(script) {
  // Check script settings:
  if (SCRIPT_SETTINGS.checkSettings(script) === false) {
    return;
  }

  // If inputData is not defined and inputDataHarvester function is available,
  // it is used as an alternative input data source:
  if (script.inputData === undefined &&
      typeof script.inputDataHarvester === 'function') {
    script.inputData = script.inputDataHarvester();
  }

  // Set script environment:
  let environment = SCRIPT_ENVIRONMENT.setEnvironment(script);

  // Set all interpreter arguments:
  let interpreterArguments = ALL_ARGUMENTS.setArguments(script);

  // Run the supplied script:
  script.scriptHandler =
    PERL_PROCESS(script.interpreter, interpreterArguments, {env: environment});

  // Send POST data to the script:
  if (script.requestMethod === 'POST') {
    script.scriptHandler.stdin.write(`${script.inputData}\n`);
  }

  // Handle script errors:
  script.scriptHandler.on('error', function(error) {
    if (typeof script.errorFunction === 'function') {
      script.errorFunction(error);
    } else {
      console.log(`camel-harness error stack: ${error.stack}`);
      console.log(`camel-harness error code: ${error.code}`);
      console.log(`camel-harness received signal: ${error.signal}`);
    }
  });

  // Handle STDOUT:
  script.scriptHandler.stdout.on('data', function(data) {
    script.stdoutFunction(data.toString('utf8'));
  });

  // Handle STDERR:
  script.scriptHandler.stderr.on('data', function(data) {
    if (typeof script.stderrFunction === 'function') {
      script.stderrFunction(data.toString('utf8'));
    }
  });

  // Handle script exit:
  script.scriptHandler.on('exit', function(exitCode) {
    if (typeof script.exitFunction === 'function') {
      script.exitFunction(exitCode);
    }
  });
};
