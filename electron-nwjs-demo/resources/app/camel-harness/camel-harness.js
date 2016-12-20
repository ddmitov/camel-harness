
// CamelHarness.js version 0.3.5
// Node.js - Electron - NW.js controller for Perl 5 scripts
// CamelHarness.js is licensed under the terms of the MIT license.
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

// Node.js - Electron - NW.js core module dependencies:
// child_process
// fs

exports.camelHarness = function(interpreter, scriptFullPath, stdoutFunction,
  stderrFunction, errorFunction, exitFunction,method, formData) {
  // Interpreter, full path of the script and
  // name of the STDOUT handling function
  // are mandatory camelHarness function parameters.
  if (interpreter !== null ||
    scriptFullPath !== null ||
    stdoutFunction  !== null) {
    // Check if the supplied Perl script exists:
    var camelHarnessFilesystemObject = require('fs');
    camelHarnessFilesystemObject.access(scriptFullPath, function(error) {
      if (error && error.code === 'ENOENT') {
        console.log('camel-harness: ' +
          'Perl script not found:\n' + scriptFullPath);
      } else {
        // Set a clean environment for the supplied Perl script:
        var cleanEnvironment = {};

        if (method !== null && (method === "GET" || method === "POST")) {
          if (formData  !== null && formData.length > 0) {
            // Handle GET requests:
            if (method === "GET") {
              cleanEnvironment['REQUEST_METHOD'] = 'GET';
              cleanEnvironment['QUERY_STRING'] = formData;
            }

            // Handle POST requests:
            if (method === "POST") {
              cleanEnvironment['REQUEST_METHOD'] = 'POST';
              cleanEnvironment['CONTENT_LENGTH'] = formData.length;
            }
          } else {
            console.log('camel-harness: ' +
              'Request method is ' + method +
              ', but form data is not supplied.');
          }
        }

        // Run the supplied Perl script:
        const spawn = require('child_process').spawn;
        const scriptHandler = spawn(interpreter,
                              ['-M-ops=fork', scriptFullPath],
                              {env: cleanEnvironment});

        // Send POST data to the Perl script:
        if (method !== null && method === "POST" && formData.length > 0) {
          scriptHandler.stdin.write(formData);
        }

        scriptHandler.stdout.on('data', function(data) {
          if (typeof global[stdoutFunction] === 'function') {
            global[stdoutFunction](data.toString('utf8'));
          } else {
            console.log('camel-harness: ' +
              'STDOUT handling function for\n' +
              scriptFullPath + '\n' + 'is not found.');
            console.log('STDOUT:\n' + data.toString('utf8'));
          }
        });

        scriptHandler.stderr.on('data', function(data) {
          if (typeof global[stderrFunction] === 'function') {
            global[stderrFunction](data.toString('utf8'));
          } else {
            console.log('camel-harness: ' +
              'STDERR handling function for\n' +
              scriptFullPath + '\n' + 'is not found.');
            console.log('STDERR:\n' + data.toString('utf8'));
          }
        });

        scriptHandler.on('error', function(errorCode) {
          if (errorFunction !== null) {
            if (typeof global[errorFunction] === 'function') {
              global[errorFunction](errorCode);
            } else {
              console.log('camel-harness: ' +
                'Error handling function for\n' +
                scriptFullPath + '\n' + 'is not found.');
              console.log('Error stack:\n' + error.stack);
              console.log('Error code: ' + error.code);
              console.log('Signal: ' + error.signal);
            }
          }
        });

        scriptHandler.on('exit', function(code) {
          if (exitFunction !== null) {
            if (typeof global[exitFunction] === 'function') {
              global[exitFunction](code);
            } else {
              console.log('camel-harness: ' +
                'Exit handling function for\n' +
                scriptFullPath + '\n' + 'is not found.');
              console.log('Exit code: ' + exitCode);
            }
          }
        });
      }
    });
  } else {
    console.log('camel-harness: ' +
      'Interpreter, script full path or ' +
      'STDOUT handling function name are not supplied.');
    console.log('camel-harness minimal invocation:\n' +
      'camelHarness(interpreter, scriptFullPath, stdoutFunction, ' +
      'null, null, null, null, null)');
  }
};
