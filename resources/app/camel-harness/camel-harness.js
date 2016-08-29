
// CamelHarness.js version 0.2.0
// Electron and NW.js adapter for Perl 5 scripts
// CamelHarness.js is licensed under the terms of GNU GPL version 3.
// Dimitar D. Mitov, 2016.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


// Node.js Module Dependencies
// (available in both Electron and NW.js):
// child_process
// fs
// os
// path


// Global variables for CamelHarness.js:
var camelHarnessFilesystemObject = require('fs');
var portablePerlInterpreterSubdirectory = "perl/bin";
var perlInterpreterFullPath;


// Determine the operating system,
// set all operating-system-specific variables and
// find a Perl interpreter:
if (navigator.userAgent.match(/Electron/) || typeof(nw) !== 'undefined') {
    // Determine the operating system:
    var osObject = require('os');
    var camelHarnessPlatform = osObject.platform();

    var camelHarnessPathObject;
    var perlInterpreterFileName;
    if (camelHarnessPlatform !== "win32") {
        perlInterpreterFileName = "perl";
        camelHarnessPathObject = require('path').posix;
    } else {
        perlInterpreterFileName = "perl.exe";
        camelHarnessPathObject = require('path').win32;
    }

    // Get the full path of the directory where
    // Electron or NW.js binary is located:
    var binaryPath = process.execPath;
    var binaryDir = camelHarnessPathObject.dirname(binaryPath);

    // Compose the full path to the portable Perl interpreter (if any):
    var portablePerlInterpreterFullPath =
        camelHarnessPathObject.join(
                binaryDir,
                portablePerlInterpreterSubdirectory,
                perlInterpreterFileName);

    // Determine where is the Perl interpreter:
    camelHarnessFilesystemObject
        .access(portablePerlInterpreterFullPath, function(error) {
        // If portable Perl interpreter is not found,
        // determine the full path of the first Perl interpreter on PATH:
        if (error && error.code === 'ENOENT') {
            var perlFullPathTester = "perl -e 'print $^X;'";
            var exec = require('child_process').exec;
            exec(perlFullPathTester, function (error, stdout, stderr) {
                if (stdout) {
                    perlInterpreterFullPath = stdout;
                    console.log(
                        'CamelHarness.js: Perl interpreter found on PATH: ' +
                        perlInterpreterFullPath);
                } else {
                    console.log('CamelHarness.js: No Perl interpreter found.');
                }
            });
        } else {
            perlInterpreterFullPath = portablePerlInterpreterFullPath;
            console.log(
                'CamelHarness.js: Portable Perl interpreter found: ' +
                perlInterpreterFullPath);
        }
    });
} else {
    console.log(
        'CamelHarness.js: ' +
        'This library is not usefull outside of Electron or NW.js.');
}


function camelHarness(scriptFullPath, stdoutFunction,
    stderrFunction, errorFunction, exitFunction,method, formData) {
    if (navigator.userAgent.match(/Electron/) || typeof(nw) !== 'undefined') {
        if (perlInterpreterFullPath !== null) {
            // The full path of the script and
            // the name of the STDOUT handling function
            // are mandatory camelHarness function parameters.
            if (scriptFullPath !== null || stdoutFunction  !== null) {
                // Check if the supplied Perl script exists:
                camelHarnessFilesystemObject
                    .access(scriptFullPath, function(error) {
                    if (error && error.code === 'ENOENT') {
                        console.log('CamelHarness.js: ' +
                            'Perl script not found:\n' +
                            scriptFullPath);
                    } else {
                        // Set a clean environment for the supplied Perl script:
                        var cleanEnvironment = {};

                        if (method !== null &&
                            (method === "GET" || method === "POST")) {
                            if (formData  !== null && formData.length > 0) {
                                // Handle GET requests:
                                if (method === "GET") {
                                    cleanEnvironment['REQUEST_METHOD'] = 'GET';
                                    cleanEnvironment['QUERY_STRING'] = formData;
                                }

                                // Handle POST requests:
                                if (method === "POST") {
                                    cleanEnvironment['REQUEST_METHOD'] = 'POST';
                                    cleanEnvironment['CONTENT_LENGTH'] =
                                        formData.length;
                                }
                            } else {
                                console.log('CamelHarness.js: ' +
                                    'Request method is ' + method +
                                    ', but form data is not supplied.');
                            }
                        }

                        // Run the supplied Perl script:
                        const spawn = require('child_process').spawn;
                        const scriptHandler = spawn(perlInterpreterFullPath,
                                            ['-M-ops=fork', scriptFullPath],
                                            {env: cleanEnvironment});

                        // Send POST data to the Perl script:
                        if (method !== null && method === "POST" &&
                            formData.length > 0) {
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
                                console.log('STDOUT:\n' +
                                    data.toString('utf8'));
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
                                console.log('STDERR:\n' +
                                    data.toString('utf8'));
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
                                    console.log('Error code: ' +
                                        error.code);
                                    console.log('Signal: ' +
                                        error.signal);
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
                    'Full path of a Perl script and ' +
                    'STDOUT handling function name are not supplied.');
                console.log('CamelHarness.js minimal invocation:\n' +
                    'camelHarness(scriptFullPath, stdoutFunction, ' +
                    'null, null, null, null, null)');
            }
        }else {
            console.log('CamelHarness.js: ' +
                'This library is not usefull without a Perl interpreter.');
        }
    } else {
        console.log('CamelHarness.js: ' +
            'This library is not usefull outside of Electron or NW.js.');
    }
}
