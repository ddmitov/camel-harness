'use strict';

// camel-harness npm test

// Load the camel-harness package:
var camelHarness = require('../src/camel-harness.js');

// Determine the operating system and initialize a suitable 'path' object:
var os = require('os');
var platform = os.platform();

var path;
if (platform !== 'win32') {
  path = require('path').posix;
} else {
  path = require('path').win32;
}

// Compose the full path of the Perl test script:
var perlTestScriptFullPath = path.join(__dirname, 'camel-harness-test.pl');

// Initialize the Perl test script object:
var perlTestScript = {};

perlTestScript.interpreter = 'perl';

var interpreterSwitches = [];
interpreterSwitches.push('-W');
perlTestScript.interpreterSwitches = interpreterSwitches;

perlTestScript.scriptFullPath = perlTestScriptFullPath;

perlTestScript.stdoutFunction = function(stdout) {
  console.log('camel-harness STDOUT test: ' + stdout);
};

perlTestScript.stderrFunction = function(stderr) {
  console.log('camel-harness STDERR test: ' + stderr);
};

perlTestScript.errorFunction = function(error) {
  if (error && error.code === 'ENOENT') {
    console.log('Perl interpreter was not found.');
  }
};

perlTestScript.exitFunction = function(exitCode) {
  console.log('camel-harness Perl test script exited with exit code ' +
    exitCode);
};

// Start the Perl test script:
camelHarness.startScript(perlTestScript);
