
// CamelHarness.js version 0.2.0
// Electron and NW.js adapter for Perl 5 scripts
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

// Node.js Module Dependencies (available in both Electron and NW.js):
// child_process
// fs

function camelHarness(interpreter, scriptFullPath, stdoutFunction,
  stderrFunction, errorFunction, exitFunction,method, formData) {
  if (navigator.userAgent.match(/Electron/) || typeof(nw) !== 'undefined') {
    // Interpreter, full path of the script and
    // name of the STDOUT handling function
    // are mandatory camelHarness function parameters.
    if (interpreter !== null ||
      scriptFullPath !== null ||
      stdoutFunction  !== null) {
      // Check if the supplied Perl script exists:
      var camelHarnessFilesystemObject = require('fs');
      camelHarnessFilesystemObject
        .access(scriptFullPath, function(error) {
        if (error && error.code === 'ENOENT') {
          console.log('CamelHarness.js: ' +
            'Perl script not found:\n' +
            scriptFullPath);
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
              console.log('CamelHarness.js: ' +
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
            if (typeof window[stdoutFunction] === 'function') {
              window[stdoutFunction](data.toString('utf8'));
            } else {
              console.log('CamelHarness.js: ' +
                'STDOUT handling function for\n' +
                scriptFullPath + '\n' +
                'is not found.');
              console.log('STDOUT:\n' + data.toString('utf8'));
            }
          });

          scriptHandler.stderr.on('data', function(data) {
            if (typeof window[stderrFunction] === 'function') {
              window[stderrFunction](data.toString('utf8'));
            } else {
              console.log('CamelHarness.js: ' +
                'STDERR handling function for\n' +
                scriptFullPath + '\n' +
                'is not found.');
              console.log('STDERR:\n' + data.toString('utf8'));
            }
          });

          scriptHandler.on('error', function(errorCode) {
            if (errorFunction !== null) {
              if (typeof window[errorFunction] === 'function') {
                window[errorFunction](errorCode);
              } else {
                console.log('CamelHarness.js: ' +
                  'Error handling function for\n' +
                  scriptFullPath + '\n' +
                  'is not found.');
                console.log('Error stack:\n' + error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal: ' + error.signal);
              }
            }
          });

          scriptHandler.on('exit', function(code) {
            if (exitFunction !== null) {
              if (typeof window[exitFunction] === 'function') {
                window[exitFunction](code);
              } else {
                console.log('CamelHarness.js is: ' +
                  'Exit handling function for\n' +
                  scriptFullPath + '\n' +
                  'is not found.');
                console.log('Exit code: ' + exitCode);
              }
            }
          });
        }
      });
    } else {
      console.log('CamelHarness.js: ' +
        'Interpreter, script full path or ' +
        'STDOUT handling function name are not supplied.');
      console.log('CamelHarness.js minimal invocation:\n' +
        'camelHarness(interpreter, scriptFullPath, stdoutFunction, ' +
        'null, null, null, null, null)');
    }
  } else {
    console.log('CamelHarness.js: ' +
      'This library is not usefull outside of Electron or NW.js.');
  }
}
