'use strict';

// camel-harness version 0.6.2
// Node.js - Electron - NW.js controller for Perl 5 scripts
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

// Core dependencies:
// child_process
// fs

const spawn = require('child_process').spawn;
const filesystemObject = require('fs');

module.exports.startScript = function(scriptObject) {
  // Perl interpreter, full path of the Perl script and
  // name of the STDOUT handling function
  // are mandatory function parameter object properties.
  if (scriptObject.interpreter !== undefined ||
    scriptObject.scriptFullPath !== undefined ||
    typeof scriptObject.stdoutFunction === 'function') {
    // Check if the supplied script exists:
    filesystemObject.access(scriptObject.scriptFullPath, function(error) {
      if (error && error.code === 'ENOENT') {
        console.log(scriptObject.scriptFullPath + ' was not found.');
      } else {
        var scriptEnvironment = process.env;

        if (scriptObject.method !== undefined &&
          (scriptObject.method === 'GET' || scriptObject.method === 'POST')) {
          if (scriptObject.formData !== undefined &&
            scriptObject.formData.length > 0) {
            // Handle GET requests:
            if (scriptObject.method === 'GET') {
              scriptEnvironment['REQUEST_METHOD'] = 'GET';
              scriptEnvironment['QUERY_STRING'] = scriptObject.formData;
            }

            // Handle POST requests:
            if (scriptObject.method === 'POST') {
              scriptEnvironment['REQUEST_METHOD'] = 'POST';
              scriptEnvironment['CONTENT_LENGTH'] =
                scriptObject.formData.length;
            }
          } else {
            console.log('Request method is ' + method + ', ' +
                        'but form data is not supplied.');
          }
        }

        if (scriptObject.method === undefined &&
          scriptObject.formData !== undefined &&
          scriptObject.formData.length > 0) {
          console.log('Form data is supplied, ' +
                      'but request method is not set.');
        }

        // Handle any interpreter switches:
        var interpreterArguments =[]; // they must be an array, not a string!
        if (scriptObject.interpreterSwitches !== undefined &&
        scriptObject.interpreterSwitches.length > 0) {
          // Escape any special characters:
          scriptObject.interpreterSwitches.replace(/\\/g,   '\\\\');
          scriptObject.interpreterSwitches.replace(/'/g,    '\\\'');
          scriptObject.interpreterSwitches.replace(/"/g,    '\\"');
          scriptObject.interpreterSwitches.replace(/\x08/g, '\\b');
          scriptObject.interpreterSwitches.replace(/\t/g,   '\\t');
          scriptObject.interpreterSwitches.replace(/\n/g,   '\\n');
          scriptObject.interpreterSwitches.replace(/\f/g,   '\\f');
          scriptObject.interpreterSwitches.replace(/\r/g,   '\\r');
          // Whitespaces separate interpreter switches from one another:
          interpreterArguments =
            scriptObject.interpreterSwitches.split(/\s{1,}/);
        }
        // The full path of the script is the minimal interpreter argument:
        interpreterArguments.push(scriptObject.scriptFullPath);

        // Run the supplied script:
        scriptObject.scriptHandler =
          spawn(scriptObject.interpreter,
            interpreterArguments,
            {env: scriptEnvironment}
          );

        // Send POST data to the script:
        if (scriptObject.method !== undefined &&
          scriptObject.method === 'POST' &&
          scriptObject.formData !== undefined &&
          scriptObject.formData.length > 0) {
          scriptObject.scriptHandler.stdin.write(scriptObject.formData);
        }

        // Log script handler errors:
      scriptObject.scriptHandler.on('error', function(error) {
        console.log('camel-harness error stack: ' + error.stack);
        console.log('camel-harness error code: ' + error.code);
        console.log('camel-harness received signal: ' + error.signal);
      });

        // Handle STDOUT:
        scriptObject.scriptHandler.stdout.on('data', function(data) {
          scriptObject.stdoutFunction(data.toString('utf8'));
        });

        // Handle STDERR:
        scriptObject.scriptHandler.stderr.on('data', function(data) {
          if (typeof scriptObject.stderrFunction === 'function') {
            scriptObject.stderrFunction(data.toString('utf8'));
          }
        });

        // Handle script exit:
        scriptObject.scriptHandler.on('exit', function(exitCode) {
          if (typeof scriptObject.exitFunction === 'function') {
            scriptObject.exitFunction(exitCode);
          }
        });
      }
    });
  } else {
    console.log('Perl interpreter, script full path or ' +
                'STDOUT handling function name are not supplied.');
  }
};
