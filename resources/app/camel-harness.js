
// CamelHarness.js version 0.1.0
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
var platform;
var pathObject;
var perlInterpreterFileName;
var perlInterpreterRelativePath = "perl/bin";
var perlInterpreterFullPath;

var fsObject = require('fs');


// Determine the operating system,
// set all operating-system-specific variables and
// find a Perl interpreter:
if (navigator.userAgent.match(/Electron/) || typeof(nw) !== 'undefined') {
	// Determine the operating system:
	var osObject = require('os');
	var platform = osObject.platform();

	if (platform !== "win32") {
		perlInterpreterFileName = "perl";
		pathObject = require('path').posix;
	} else {
		perlInterpreterFileName = "perl.exe";
		pathObject = require('path').win32;
	}

	// Get the full path of directory where Electron or NW.js binary is located:
	var binaryPath = process.execPath;
	var binaryDir = pathObject.dirname(binaryPath);

	// Compose the full path to the portable Perl interpreter (if any):
	var portablePerlInterpreterFullPath = pathObject.join(binaryDir, perlInterpreterRelativePath, perlInterpreterFileName);

	// Determine where is the Perl interpreter:
	fsObject.access(portablePerlInterpreterFullPath, function(error) {
		// If portable Perl interpreter is not found,
		// determine the full path of the first Perl interpreter on PATH:
		if (error && error.code === 'ENOENT') {
			var perlFullPathTester = "perl -e 'print $^X;'";
			var exec = require('child_process').exec;

			exec(perlFullPathTester, function (error, stdout, stderr) {
				if (stdout) {
					perlInterpreterFullPath = stdout;
					console.log('CamelHarness.js: Perl interpreter found on PATH: ' + perlInterpreterFullPath);
				} else {
					console.log('CamelHarness.js: No Perl interpreter found.');
				}
			});
		} else {
			perlInterpreterFullPath = portablePerlInterpreterFullPath;
			console.log('CamelHarness.js: Portable Perl interpreter found: ' + perlInterpreterFullPath);
		}
	});
} else {
	console.log('CamelHarness.js: This library is not usefull outside of Electron or NW.js.');
}


function camelHarness(scriptFullPath, stdoutFunction, stderrFunction, errorFunction, exitFunction, method, formData) {
	if (navigator.userAgent.match(/Electron/) || typeof(nw) !== 'undefined') {
		if (perlInterpreterFullPath !== null) {
			// The full path of the script and the name of the STDOUT handling function are mandatory camelHarness function parameters.
			if (scriptFullPath !== null || stdoutFunction  !== null) {
				// Check if the supplied Perl script exists:
				fsObject.access(scriptFullPath, function(error) {
					if (error && error.code === 'ENOENT') {
						console.log('CamelHarness.js: Supplied Perl script not found: ' + scriptFullPath);
					} else {
						// Compose the command line that has to be executed:
						var safetyArguments = " -M-ops=:dangerous -M-ops=fork ";
						var commandLine = perlInterpreterFullPath + safetyArguments + scriptFullPath;

						// Set a clean environment for the supplied Perl script:
						var cleanEnvironment = {};

						if (method !== null) {
							if (formData.length > 0) {
								// Handle POST requests:
								if (method === "POST") {
									cleanEnvironment['REQUEST_METHOD'] = 'POST';
									cleanEnvironment['CONTENT_LENGTH'] = formData.length;
								}

								// Handle GET requests:
								if (method === "GET") {
									cleanEnvironment['REQUEST_METHOD'] = 'GET';
									cleanEnvironment['QUERY_STRING'] = formData;
								}
							} else {
								console.log('CamelHarness.js: Form data was not supplied.');
							}
						}

						// Run the supplied Perl script:
						var exec = require('child_process').exec;
						var scriptHandler = exec(commandLine, {env: cleanEnvironment}, function (errorCode, stdout, stderr) {
							if (stdout) {
								if (typeof window[stdoutFunction] === 'function') {
									window[stdoutFunction](stdout);
								} else {
									console.log('CamelHarness.js: The STDOUT handling function was not found.');
								}
							}

							if (stderr && stderrFunction !== null) {
								if (typeof window[stderrFunction] === 'function') {
									window[stderrFunction](stderr);
								} else {
									console.log('CamelHarness.js: The STDERR handling function was not found.');
								}
							}

							if (errorCode && errorFunction !== null) {
								if (typeof window[errorFunction] === 'function') {
									window[errorFunction](errorCode);
								} else {
									console.log('CamelHarness.js: The error code handling function was not found.');
								}
							}
						});

						// Send POST data to the Perl script:
						if (method !== null && method === "POST" && formData.length > 0) {
							scriptHandler.stdin.write(formData);
						}

						scriptHandler.on('exit', function (code) {
							if (exitFunction !== null) {
								if (typeof window[exitFunction] === 'function') {
									window[exitFunction](code);
								} else {
									console.log('CamelHarness.js is: The script exit handling function was not found.');
								}
							}
						});
					}
				});
			} else {
				console.log('CamelHarness.js: Full path of a Perl script and STDOUT handling function name are not supplied.');
				console.log('CamelHarness.js: Minimal invocation: camelHarness(scriptFullPath, stdoutFunction, null, null, null, null, null)');
			}
		}else {
			console.log('CamelHarness.js: This library is not usefull without a Perl interpreter.');
		}
	} else {
		console.log('CamelHarness.js: This library is not usefull outside of Electron or NW.js.');
	}
}
