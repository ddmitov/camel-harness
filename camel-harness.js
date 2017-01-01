
// camel-harness version 0.4.5
// Node.js - Electron - NW.js controller for Perl 5 scripts
// camel-harness is licensed under the terms of the MIT license.
// Copyright (c) 2016 Dimitar D. Mitov

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

module.exports.startScript = function(scriptObject) {
  // Interpreter, full path of the script and
  // name of the STDOUT handling function
  // are mandatory function parameter object properties.
  if (scriptObject.interpreter !== undefined ||
    scriptObject.scriptFullPath !== undefined ||
    typeof scriptObject.stdoutFunction === 'function') {
    // Check if the supplied Perl script exists:
    const filesystemObject = require('fs');
    filesystemObject.access(scriptObject.scriptFullPath, function(error) {
      if (error && error.code === 'ENOENT') {
        console.log(scriptObject.scriptFullPath + ' was not found.');
      } else {
        var scriptEnvironment = process.env;

        if (scriptObject.method !== undefined &&
          (scriptObject.method === "GET" || scriptObject.method === "POST")) {
          if (scriptObject.formData !== undefined &&
            scriptObject.formData.length > 0) {
            // Handle GET requests:
            if (scriptObject.method === "GET") {
              scriptEnvironment['REQUEST_METHOD'] = 'GET';
              scriptEnvironment['QUERY_STRING'] = scriptObject.formData;
            }

            // Handle POST requests:
            if (scriptObject.method === "POST") {
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
          (scriptObject.formData !== undefined &&
          scriptObject.formData.length > 0)) {
          console.log('Form data is supplied, ' +
                      'but request method is not set.');
        }

        // Run the supplied Perl script:
        const spawn = require('child_process').spawn;
        const scriptHandler =
          spawn(scriptObject.interpreter,
            ['-M-ops=fork', scriptObject.scriptFullPath],
            {env: scriptEnvironment}
          );

        // Send POST data to the Perl script:
        if (scriptObject.method !== undefined &&
          scriptObject.method === "POST" &&
          scriptObject.formData.length > 0) {
          scriptHandler.stdin.write(scriptObject.formData);
        }

        // Handle STDOUT:
        scriptHandler.stdout.on('data', function(data) {
          scriptObject.stdoutFunction(data.toString('utf8'));
        });

        // Handle STDERR:
        scriptHandler.stderr.on('data', function(data) {
          if (typeof scriptObject.stderrFunction === 'function') {
            scriptObject.stderrFunction(data.toString('utf8'));
          }
        });

        // Handle script errors:
        scriptHandler.on('error', function(errorCode) {
          if (typeof scriptObject.errorFunction === 'function') {
            scriptObject.errorFunction(errorCode);
          }
        });

        // Handle script exit:
        scriptHandler.on('exit', function(exitCode) {
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
