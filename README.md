camel-harness
--------------------------------------------------------------------------------
[![NPM](https://nodei.co/npm/camel-harness.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/camel-harness/)  
[![GitHub Version](https://img.shields.io/github/release/ddmitov/camel-harness.svg)](https://github.com/ddmitov/camel-harness/releases)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![NPM Version](https://img.shields.io/npm/v/camel-harness.svg)](https://www.npmjs.com/package/camel-harness)
[![Travis CI Build Status](https://travis-ci.org/ddmitov/camel-harness.svg?branch=master)](https://travis-ci.org/ddmitov/camel-harness)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/ddmitov/camel-harness?branch=master&svg=true)](https://ci.appveyor.com/project/ddmitov/camel-harness)  
[![bitHound Overall Score](https://www.bithound.io/github/ddmitov/camel-harness/badges/score.svg)](https://www.bithound.io/github/ddmitov/camel-harness)
[![Coverity Scan Build Status](https://scan.coverity.com/projects/11336/badge.svg)](https://scan.coverity.com/projects/ddmitov-camel-harness)
[![Snyk Status](https://snyk.io/test/github/ddmitov/camel-harness/badge.svg)](https://snyk.io/test/github/ddmitov/camel-harness)  

[Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) package for asynchronous handling of [Perl](https://www.perl.org/) scripts

## Quick Start
``npm install camel-harness``  

```javascript
const camelHarness = require('camel-harness');

var perlScriptObject = {};
perlScriptObject.interpreter = 'perl';
perlScriptObject.scriptFullPath = '/test/test.pl';

perlScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

camelHarness.startScript(perlScriptObject);
```

## Core Dependencies
* ``child_process``
* ``fs``

## External Dependency
The only external dependency of camel-harness is a Perl interpreter on PATH or  
any other Perl interpreter identified by its full pathname.  

camel-harness npm package test will fail if no ``perl`` binary is available on PATH.  

## API

```javascript
const camelHarness = require('camel-harness');

var perlScriptObject = {};

 // mandatory object property
perlScriptObject.interpreter = 'perl';

 // mandatory object property
perlScriptObject.scriptFullPath = '/test/test.pl';

// mandatory object property:
perlScriptObject.stdoutFunction = function(stdout) {
  document.getElementById('DOM-element-id').innerHTML = stdout;
};

perlScriptObject.stderrFunction = function(stderr) {
  console.log('Perl script STDERR:\n' + stderr);
};

perlScriptObject.errorFunction = function(error) {
  if (error && error.code === 'ENOENT') {
    console.log('Perl interpreter was not found.');
  }
};

perlScriptObject.exitFunction = function(exitCode) {
  console.log('perl script exited with exit code ' + exitCode);
};

// interpreter switches must be an array:
var interpreterSwitches = [];
interpreterSwitches.push('-W');
perlScriptObject.interpreterSwitches = interpreterSwitches;

perlScriptObject.requestMethod = 'POST';

perlScriptObject.inputDataHarvester = function() {
  var data = document.getElementById('input-box-id').value;
  return data;
}

camelHarness.startScript(perlScriptObject);
```

* **perlInterpreter:**  
  This is the full pathname of a Perl interpreter or just the filename of a Perl interpreter on PATH.  
  *This object property is mandatory.*  

* **scriptFullPath:**  
  This is the full path of the Perl script that is going to be executed.  
  *This object property is mandatory.*  

* **stdoutFunction:**  
  This is the function that will be executed every time when output is available on STDOUT.  
  The only parameter passed to the ``stdoutFunction`` is the STDOUT string.  
  *This object property is mandatory.*  

* **stderrFunction:**  
  This is the function that will be executed every time when output is available on STDERR.  
  The only parameter passed to this function is the STDERR string.  

* **errorFunction:**  
  This is the function that will be executed on script error.  
  The only parameter passed to this function is the error object.  
  The ``errorFunction`` could be used for displaying a message when Perl interpreter is not found.  

* **exitFunction:**  
  This is the function that will be executed when a Perl script is finished.  
  The only parameter passed to this function is the exit code string.  

* **interpreterSwitches:**  
  They are supplied to the Perl interpreter on runtime.  

* **requestMethod:**  
  Only ``GET`` or ``POST`` are recognized.  
  This object property requires ``inputData`` to be set.  

* **inputData:**  
  This object property requires ``requestMethod`` to be set.  

* **inputDataHarvester:**  
  This is a function that can harvest input data from an HTML form or any other data source and supply it as its return value. If ``inputData`` is defined, ``inputDataHarvester`` will not be used, but if ``inputData`` is not defined and ``inputDataHarvester`` is available, it will be used as an input data source.  

  Single input box simple example with no dependencies:  

  ```javascript
  perlScriptObject.inputDataHarvester = function() {
    var data = document.getElementById('input-box-id').value;
    return data;
  }
  ```

  Whole form simple example based on [jQuery](https://jquery.com/):  

  ```javascript
  perlScriptObject.inputDataHarvester = function() {
    var formData = $('#form-id').serialize();
    return formData;
  }
  ```

## Interactive Scripts
camel-harness can also start and communicate with interactive scripts having their own event loops and capable of repeatedly receiving STDIN input. Use the following code to send data to an interactive script waiting for input on STDIN:

```javascript
var data = document.getElementById('interactive-script-input').value;
perlScriptObject.scriptHandler.stdin.write(data);
```

The camel-harness demo packages for [Electron](https://www.npmjs.com/package/camel-harness-demo-electron) and [NW.js](https://www.npmjs.com/package/camel-harness-demo-nwjs) include a Perl script that can be constantly fed with data from an HTML interface. Perl with the ``AnyEvent`` Perl module has to be available on PATH.  

## [Electron Demo](https://www.npmjs.com/package/camel-harness-demo-electron)

## [NW.js Demo](https://www.npmjs.com/package/camel-harness-demo-nwjs)

## [Thanks and Credits](./CREDITS.md)

## [License](./LICENSE.md)
MIT © 2016 - 2017 Dimitar D. Mitov  
