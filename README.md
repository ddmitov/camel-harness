camel-harness
--------------------------------------------------------------------------------
[![GitHub Version](https://img.shields.io/github/release/ddmitov/camel-harness.svg)](https://github.com/ddmitov/camel-harness/releases)
[![NPM Version](https://img.shields.io/npm/v/camel-harness.svg)](https://www.npmjs.com/package/camel-harness)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)  
[![Travis CI Build Status](https://travis-ci.org/ddmitov/camel-harness.svg?branch=master)](https://travis-ci.org/ddmitov/camel-harness)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/ddmitov/camel-harness?branch=master&svg=true)](https://ci.appveyor.com/project/ddmitov/camel-harness)  
[![Coverity Scan Build Status](https://scan.coverity.com/projects/11336/badge.svg)](https://scan.coverity.com/projects/ddmitov-camel-harness)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4b8a244d415b4bafbdf9e50148bf7372)](https://www.codacy.com/app/ddmitov/camel-harness?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ddmitov/camel-harness&amp;utm_campaign=Badge_Grade)
[![Snyk Status](https://snyk.io/test/github/ddmitov/camel-harness/badge.svg)](https://snyk.io/test/github/ddmitov/camel-harness)  

[Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) package for asynchronous handling of [Perl](https://www.perl.org/) scripts

## Quick Start
``npm install camel-harness``  

```javascript
const camelHarness = require("camel-harness");

let perlScript = {};
perlScript.interpreter = "perl";
perlScript.scriptFullPath = "/test/test.pl";

perlScript.stdoutFunction = function (stdout) {
  console.log(stdout);
};

camelHarness.startScript(perlScript);
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
const camelHarness = require("camel-harness");

// Perl script settings object:
let perlScript = {};

 // mandatory object property
perlScript.interpreter = "perl";

 // mandatory object property
perlScript.scriptFullPath = "/test/test.pl";

// mandatory object property:
perlScript.stdoutFunction = function (stdout) {
  document.getElementById("DOM-element-id").textContent = stdout;
};

perlScript.stderrFunction = function (stderr) {
  console.log("Perl script STDERR:\n");
  console.log(stderr);
};

perlScript.errorFunction = function (error) {
  if (error && error.code === "ENOENT") {
    console.log("Perl interpreter was not found.");
  }
};

perlScript.exitFunction = function (exitCode) {
  console.log(`Perl script exited with exit code ${exitCode}`);
};

perlScript.interpreterSwitches = [];
perlScript.interpreterSwitches.push("-W");

perlScript.scriptArguments = [];
perlScript.scriptArguments.push("test");

perlScript.environment = {};
perlScript.environment.PATH = process.env.PATH;
perlScript.environment.TEST = "test";

perlScript.requestMethod = "POST";

perlScript.inputData = function () {
  let data = document.getElementById("input-box-id").value;
  return data;
}

camelHarness.startScript(perlScript);
```

* **perlInterpreter:**  
  ``String`` containing the full pathname of a Perl interpreter or the filename of a Perl interpreter on PATH  
  *This object property is mandatory.*  

* **scriptFullPath:**  
  ``String`` containing the full path of the Perl script that is going to be executed  
  *This object property is mandatory.*  

* **stdoutFunction:**  
  will be executed every time data is available on STDOUT  
  The only parameter passed to the ``stdoutFunction`` is the STDOUT ``String``.  
  *This object property is mandatory.*  

* **stderrFunction:**  
  will be executed every time data is available on STDERR  
  The only parameter passed to the ``stderrFunction`` is the STDERR ``String``.  

* **errorFunction:**  
  will be executed on Perl script error  
  The only parameter passed to the ``errorFunction`` is the error ``Object``.  
  The ``errorFunction`` can be used to display a message when Perl interpreter is not found.  

* **exitFunction:**  
  will be executed when Perl script has ended  
  The only parameter passed to the ``exitFunction`` is the exit code ``String``.  

* **interpreterSwitches:**  
  ``Array`` supplied to the Perl interpreter  

* **scriptArguments:**  
  ``Array`` supplied to the Perl script  

* **environment:**  
  ``Object`` containing clean environment for the Perl script and its interpreter  

* **requestMethod:**  
  ``String`` holding either ``GET`` or ``POST`` as a value.  
  ``requestMethod`` has to be set if the Perl script reads its input data in a CGI-like fashion.

* **inputData:**  
  ``String`` or ``Function`` supplying user data as its return value.  

  Single HTML input box example with no dependencies:  

  ```javascript
  perlScript.inputData = function () {
    let data = document.getElementById("input-box-id").value;
    return data;
  }
  ```

  Whole HTML form example based on [jQuery](https://jquery.com/):  

  ```javascript
  perlScript.inputData = function () {
    let formData = $("#form-id").serialize();
    return formData;
  }
  ```

## Interactive Scripts
camel-harness can also start and communicate with interactive scripts having their own event loops and capable of repeatedly receiving STDIN input. Use the following code to send data to an interactive script waiting for input on STDIN:

```javascript
let data = document.getElementById("interactive-script-input").value;
perlScript.scriptHandler.stdin.write(data);
```

The camel-harness demo packages for [Electron](https://www.npmjs.com/package/camel-harness-demo-electron) and [NW.js](https://www.npmjs.com/package/camel-harness-demo-nwjs) include a Perl script that can be constantly fed with data from an HTML interface. Perl with the ``AnyEvent`` CPAN module has to be available on PATH.  

## [Electron Demo](https://www.npmjs.com/package/camel-harness-demo-electron)

## [NW.js Demo](https://www.npmjs.com/package/camel-harness-demo-nwjs)

## [Credits](./CREDITS.md)

## [License](./LICENSE.md)
MIT 2016 - 2018  
Dimitar D. Mitov  
